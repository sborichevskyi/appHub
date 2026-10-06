import dotenv from 'dotenv';
dotenv.config();

import { initDb } from '../db/sequalize';
import { jobQueue } from './jobQueue';
import { UserProfile } from '../db/sequalize';
import { Job } from '../db/sequalize';
import { fetchAdzunaJobs } from '../scrapping/sources/adzunaSource';
import { detectLevel } from '../utils/detectLevel';

(async () => {
  await initDb();

  console.log('🟢 Job worker started, waiting for jobs...');

  jobQueue.process('fetch-jobs', async (job) => {
    const { profileId } = job.data;
    const profile = await UserProfile.findByPk(profileId);
    if (!profile) throw new Error('Profile not found');

    const vacancies = await fetchAdzunaJobs(profile);

    if (!vacancies || vacancies.length === 0) {
      console.log('No vacancies found');
      return;
    }

    for (const v of vacancies) {
      const normalizedUrl = v.url.split('?')[0];
      const level = detectLevel(v.title, v.description);

      await Job.upsert({
        title: v.title,
        company: v.company,
        description: v.description,
        url: normalizedUrl,
        country: v.country,
        location: v.location,
        source: v.source,
        level: level,
        isCustom: false,
      },
    );
    }

    console.log(`Fetched and saved ${vacancies.length} jobs for profile ${profileId}`);
  });

  jobQueue.process('refresh-all', async () => {
    const profiles = await UserProfile.findAll({ attributes: ['id'] });
    await Promise.all(profiles.map((p) => jobQueue.add('fetch-jobs', { profileId: p.id })));
  });

  const REFRESH_CRON = '0 */6 * * *';

  // Remove stale repeatable jobs left in Redis (old names or changed cron)
  const repeatableJobs = await jobQueue.getRepeatableJobs();
  await Promise.all(
    repeatableJobs
      .filter((r) => !(r.name === 'refresh-all' && r.cron === REFRESH_CRON))
      .map((r) => jobQueue.removeRepeatableByKey(r.key)),
  );

  await jobQueue.add('refresh-all', {}, { repeat: { cron: REFRESH_CRON } });

  jobQueue.on('completed', (job) => console.log(`✅ Job ${job.id} completed!`));
  jobQueue.on('failed', (job, err) => console.log(`❌ Job ${job.id} failed:`, err));
})();


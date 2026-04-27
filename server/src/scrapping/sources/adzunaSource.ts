import axios from "axios";
import dotenv from "dotenv";

import { AdzunaQueryBuilder } from "../query/adzunaQueryBuilder";
import { UserProfile } from "../../db/models/UserProfile";
import { ScrapedVacancy } from "../types";
dotenv.config();

const normalize = (item: any, country: string): ScrapedVacancy => ({
  source: "adzuna",
  externalId: item.id,
  title: item.title,
  company: item.company.display_name,
  country,
  location: item.location.display_name,
  url: item.redirect_url,
  description: item.description,
  salaryMin: item.salary_min,
  salaryMax: item.salary_max,
  currency: item.currency,
});

export const fetchAdzunaJobs = async (profile: UserProfile, page = 1) => {
  const params = AdzunaQueryBuilder(profile);
  const country = profile.country;

  params.app_id = process.env.ADZUNA_API_ID!;
  params.app_key = process.env.ADZUNA_API_KEY!;

  const url = `${process.env.ADZUNA_BASE_URL}/jobs/${country}/search/${page}`;

  try {
    console.log("ADZUNA URL:", url);
    console.log("ADZUNA INPUT:", profile);
    const response = await axios.get(url, { params });
    console.log("Adzuna request params:", params);

    if (!response.data.results || response.data.results.length === 0) {
      console.warn("No results returned from Adzuna");
      return [];
    }

    if (!country) {
      console.warn(
        "Country is missing in profile, cannot normalize Adzuna data",
      );
      return [];
    }

    return response.data.results.map((item: any) =>
      normalize(item, country.toUpperCase()),
    );
  } catch (err: any) {
    console.error("Adzuna fetch error", err.response?.data || err.message);
    return [];
  }
};

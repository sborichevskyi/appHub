export interface ScrapedVacancy {
  source: 'adzuna';
  externalId: string;
  title: string;
  company: string;
  country: string;
  location: string;
  url: string;
  description?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
}
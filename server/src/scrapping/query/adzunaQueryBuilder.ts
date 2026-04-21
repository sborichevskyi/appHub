import { UserProfile } from "../../db/models/UserProfile";

export interface AdzunaQueryParams {
  what?: string;
  where?: string;
  results_per_page: number;
  sort_by: "date";
  app_id?: string;
  app_key?: string;
}

export const AdzunaQueryBuilder = (profile: UserProfile): AdzunaQueryParams => {
  const params: AdzunaQueryParams = {
    results_per_page: 10,
    sort_by: "date",
  };
  const MAX_KEYWORDS = 2;
  const whatParts: string[] = [];

  if (profile.role) {
    // if (profile.level) {
    //   whatParts.push(`${profile.level} ${profile.role}`);
    // } else {
      whatParts.push(profile.role);
    // }
  }
  if (profile.keywords?.length) {
    const cleanKeywords = profile.keywords
      .map((k) => k.trim())
      .filter(Boolean)
      .slice(0, MAX_KEYWORDS);

    if (cleanKeywords.length) {
      whatParts.push(cleanKeywords.join(" "));
    }
  }

  params.what = whatParts.join(" ");

  if (profile.location) {
    params.where =
      profile.location.toLowerCase() === "remote" ? "remote" : profile.location;
  }

  return params;
};

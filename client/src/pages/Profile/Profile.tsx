import { useEffect, useState } from "react";

import {
  CustomSelect,
  type Option,
} from "../../components/CustomSelect/CustomSelect";
// import { Input } from '../../components/Input/Input';
import { Button } from "../../components/Button/Button";

import { roles } from "../../constants/roles";
import { skills } from "../../constants/skills";
import { countries } from "../../constants/countries";
import { citiesByCountry as cities } from "../../constants/cities";
import { levels } from "../../constants/levels";
import { useAppSelector } from "../../redux/hooks";

import {
  useGetProfileQuery,
  useSetProfileMutation,
} from "../../features/profile/profileApi";
import type {
  Country,
  Level,
  Role,
  Skill,
} from "../../features/profile/profileSlice";

import "./Profile.scss";
import { isDemoMode } from "../../shared/heplers/demoHelper";
import { demoProfile } from "../../constants/demoProfile";
import { useAuth } from "../../shared/hooks/authHook";
import { Loader } from "../../components/Loader/Loader";

export const Profile: React.FC = () => {
  const isDemo = isDemoMode();
  const { isAuthenticated } = useAuth();
  const [setProfile, { isLoading: isProfileLoading, error: profileError }] =
    useSetProfileMutation();
  const token = useAppSelector((state) => state.auth.token);
  const { data: apiProfile, isLoading } = useGetProfileQuery(undefined, {
    skip: !token || isDemo,
    refetchOnMountOrArgChange: true,
  });

  const profile = isDemo ? demoProfile : apiProfile;

  const [role, setRole] = useState<Role | null>(
    roles.find((r) => r.query === profile?.role) ?? null,
  );
  const [country, setCountry] = useState<Country | null>(
    countries.find((c) => c.query === profile?.country) ?? null,
  );
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>(
    skills.filter((skill) => profile?.keywords?.includes(skill.query)),
  );
  const [location, setLocation] = useState<Option | null>(
    profile?.country
      ? (cities[profile.country as keyof typeof cities]?.find(
          (c) => c.query === profile.location,
        ) ?? null)
      : null,
  );
  const [level, setLevel] = useState<Level | null>(
    levels.find((l) => l.query === profile?.level) ?? null,
  );

  const citiesOptions: Option[] = country
    ? (cities[country.query as keyof typeof cities]?.map((c) => ({
        label: c.label,
        value: c.label,
        query: c.query,
      })) ?? [])
    : [];

  const skillsOptions: Option[] = skills.map((s) => ({
    label: s.label,
    value: s.value,
    query: s.query,
  }));

  const [saved, setSaved] = useState(false);

  const handleSkillsChange = (selected: Option[]) => {
    setSelectedSkills(selected);
  };

  useEffect(() => {
    if (!profile) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRole(roles.find((r) => r.query === profile.role) ?? null);

    const selectedCountry =
      countries.find((c) => c.query === profile.country) ?? null;

    setCountry(selectedCountry);

    setSelectedSkills(
      skills.filter((skill) => profile.keywords?.includes(skill.query)),
    );

    if (selectedCountry) {
      const city = cities[selectedCountry.query as keyof typeof cities]?.find(
        (c) => c.query === profile.location,
      );

      setLocation(city ?? null);
    }

    setLevel(levels.find((l) => l.query === profile.level) ?? null);
  }, [profile]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!role || !country) return;

    try {
      const profileData = {
        role: role.query,
        keywords: selectedSkills.map((s) => s.query),
        country: country.query,
        location: location?.query ?? "",
        level: level?.query ?? "",
      };

      if (isDemo) {
        console.log("Demo save:", profileData);
      } else {
        await setProfile(profileData).unwrap();
      }

      setSaved(true);
      setTimeout(() => {
        setSaved(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to set profile:", err);
    }
  };

  if (!isAuthenticated && isDemo) {
    return (
      <div className="profile-container-demo">
        <h1>My Profile</h1>
        <p>You are in demo mode, unfortunately you can not change it.</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="profile-container-empty">
        <h1>My Profile</h1>
        <p>
          Please <a href="/login">log in</a> to set up your profile.
        </p>
        <p>Or try demo mode to see sample data.</p>
      </div>
    );
  }

  if (!isDemo && (!token || isLoading)) {
    return <Loader />;
  }

  return (
    <div className="profile-container">
      {profile ? (
        <h1>Welcome back!</h1>
      ) : (
        <h1>Fill your profile to see relevant job opportunities</h1>
      )}
      <form onSubmit={handleSubmit}>
        <label htmlFor="role">Choose your role:</label>
        <CustomSelect
          id="role"
          elements={roles}
          value={role}
          onChange={(v) => setRole(v as Option)}
        />

        <label htmlFor="keywords">Skills:</label>
        <CustomSelect
          id="keywords"
          elements={skillsOptions}
          value={selectedSkills}
          onChange={(v) => handleSkillsChange(v as Option[])}
          isMulti
          max={2}
          placeholder="Select up to 2 skills"
        />

        <label htmlFor="country">Country:</label>
        <CustomSelect
          id="country"
          elements={countries}
          value={country}
          onChange={(value) => {
            setCountry(value as Option);
            setLocation(null);
          }}
        />

        <label htmlFor="location">Location:</label>
        <CustomSelect
          id="location"
          elements={citiesOptions}
          value={location}
          onChange={(v) => setLocation(v as Option)}
          placeholder="Select city"
        />

        <label htmlFor="level">Level:</label>
        <CustomSelect
          id="level"
          elements={levels}
          value={level}
          onChange={(v) => setLevel(v as Option)}
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={isProfileLoading}
        >
          {isProfileLoading ? "Saving..." : saved ? "Saved" : "Save Profile"}
        </Button>

        {profileError && <p style={{ color: "red" }}>Failed to save profile</p>}
      </form>
    </div>
  );
};

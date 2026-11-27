export type {
  StrapiCohort,
  StrapiMedia,
  StrapiMediaFormat,
  StrapiTeam,
  StrapiTeammate,
} from "@/api/strapi";

export type AcknowledgementMember = {
  id: string;
  name: string;
  isPrm: boolean;
  linkedinUrl?: string;
  headshotUrl?: string;
  headshotAlt?: string;
};

export type AcknowledgementModule = {
  id: string;
  name: string;
  prms: AcknowledgementMember[];
  researchers: AcknowledgementMember[];
  totalMembers: number;
};

export type AcknowledgementCohort = {
  id: string;
  year: number;
  label: string;
  modules: AcknowledgementModule[];
};

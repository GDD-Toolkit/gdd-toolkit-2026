/**
 * Type definitions for case studies from the API
 * Matches the structure returned by the /casestudies endpoint
 */

export type CaseStudy = {
  id: string;
  grant_name: string; 
  grant_description: string;
  grant_min_amount: number;
  grant_max_amount: number;
  time_period: string;
  eligibility: string; 
  past_awards: string;
  site_link: string;
};


export type Cohort = {
  unique_id: string;
  cohort_year: string;
  teams: Team[];
  
}

export type Team = {
  unique_id: string;
  title: string; //team name
  description: string;
}
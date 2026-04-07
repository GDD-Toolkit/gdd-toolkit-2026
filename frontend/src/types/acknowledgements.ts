export type Acknowledgement = {
  id: string;
  title: string;
  description: string;
  cohort_years: string[];        // ["2020", "2021", "2022"...]
  module_groups: string[][];     // [ ["HCD", "I&I"], ["AI Ethics"] ]
  module_group_descriptions: string[][];   // [Year][Group]
  
}
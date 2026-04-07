/**
 * Type definitions for case studies from the API
 * Matches the structure returned by the /casestudies endpoint
 */

export type CaseStudy = {
  id: string;
  casestudy_title:string;
  region_id:string;
  values:string;
  keyword:string;
  description: string;
  lesson_learned: string;
  evaluation_boxes: Object[];
  image_url:string;
  SDG: Integer; 
  test: string;

 

  
};

/**
 * Segment type for filtering case studies
 */
export type CaseStudySegment = "worthwhile" | "maldevelopment";


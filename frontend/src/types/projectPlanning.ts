export type ProjectPlanning = {
  id: string;
  name: string;
  keywords: string[];
  learning_objectives: string;
  characteristics: string;
  process: string;
  benefits: string;
  drawbacks: string;
  example: string;
  example_imgs?: string[] // *.jpeg and *png
  resources: string[] // Hyperlinks
  video_slideshow?: string // Hyperlink to slideshow/video
  evaluation: string
}


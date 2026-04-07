export type Episode = {
  number: number;
  date: string;
  url: string;
};

export type EpisodeFilters = {
  minEp: number | "";
  maxEp: number | "";
  startDate: string;
  endDate: string;
};

export type PodcastInfo = {
  podcast_id: number;
  title: string;
  description: string;
  image_url: string;
};
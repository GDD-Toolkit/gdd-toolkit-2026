export type AITool = {
  name: string;
  category: string;
  type: string;
  research: string;
  projectDevelopment: string;
  price: string;
  score: number;
};

export const tools: AITool[] = [
  {
    name: "Tool 1",
    category: "General Purpose",
    type: "Chatbot",
    research: "Research",
    projectDevelopment: "Planning",
    price: "Free",
    score: 92,
  },
  {
    name: "Tool 2",
    category: "General Purpose",
    type: "Writing Tool",
    research: "Academic",
    projectDevelopment: "Collaboration",
    price: "Freemium",
    score: 85,
  },
  {
    name: "Tool 3",
    category: "Research",
    type: "Chatbot",
    research: "Research",
    projectDevelopment: "Development",
    price: "Paid",
    score: 78,
  },
  {
    name: "Tool 4",
    category: "Research",
    type: "Writing Tool",
    research: "Data Analysis",
    projectDevelopment: "Planning",
    price: "Free",
    score: 68,
  },
  {
    name: "Tool 5",
    category: "Education",
    type: "Chatbot",
    research: "Academic",
    projectDevelopment: "Collaboration",
    price: "Freemium",
    score: 95,
  },
  {
    name: "Tool 6",
    category: "Writing and Text",
    type: "Writing Tool",
    research: "Research",
    projectDevelopment: "Development",
    price: "Paid",
    score: 73,
  },
  {
    name: "Tool 7",
    category: "Image and Video Generators",
    type: "Image Generator",
    research: "Research",
    projectDevelopment: "Development",
    price: "Free",
    score: 88,
  },
  {
    name: "Tool 8",
    category: "Audio Generators",
    type: "Audio Generator",
    research: "Academic",
    projectDevelopment: "Collaboration",
    price: "Paid",
    score: 65,
  },
  {
    name: "Tool 9",
    category: "Data Analysis",
    type: "Data Analysis",
    research: "Data Analysis",
    projectDevelopment: "Planning",
    price: "Freemium",
    score: 91,
  },
  {
    name: "Tool 10",
    category: "Design and Creativity",
    type: "Image Generator",
    research: "Research",
    projectDevelopment: "Development",
    price: "Free",
    score: 82,
  },
];
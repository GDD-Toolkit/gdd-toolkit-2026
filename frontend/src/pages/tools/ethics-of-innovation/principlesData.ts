export interface PrincipleChecklistItem {
  label?: string;
  question: string;
}

export interface PrincipleResource {
  title: string;
  href: string;
  citationPrefix?: string;
  description?: string;
}

export interface PrincipleCaseStudy {
  heading: string;
  eyebrow?: string;
  linkLabel?: string;
  linkHref?: string;
  citationPrefix?: string;
  citationSuffix?: string;
  description: string;
  embedUrl?: string;
  embedTitle?: string;
}

export interface DigitalPrincipleDetail {
  slug:
    | "user"
    | "ecosystem"
    | "scale"
    | "sustainability"
    | "data"
    | "standards"
    | "reuse"
    | "privacy"
    | "collaboration";
  number: string;
  path: string;
  title: string;
  heroPrimary: string;
  heroEmphasis: string;
  img: string;
  imgAlt: string;
  cardSummary: string;
  summary: string;
  checklist: PrincipleChecklistItem[];
  resources: PrincipleResource[];
  caseStudies?: PrincipleCaseStudy[];
}

export const DIGITAL_PRINCIPLES: DigitalPrincipleDetail[] = [
  {
    slug: "user",
    number: "01",
    path: "/ethics-of-innovation/user",
    title: "Design with the User",
    heroPrimary: "Design with",
    heroEmphasis: "the User",
    img: "/assets/images/design-user.png",
    imgAlt: "Design with the User illustration",
    cardSummary:
      "User-centered design begins with understanding the people you are designing for by utilizing conversation, observation, and co-creation.",
    summary:
      "User-centered design begins with understanding the people you are designing for by utilizing conversation, observation, and co-creation. Designing with the User is important at all points of the project. It can be incorporated at the beginning, middle, and end or at various points where your design team might want guidance. It is important for your project that your user feels involved and that the product suits their needs. By gaining their input you can determine what the user wants out of the project. By actively listening to the potential user you can synthesize other possible unexpressed needs and anticipate features that would make the project or product even more valuable and successful.",
    checklist: [
      { label: "Observation", question: "Have you observed your User?" },
      {
        label: "Conversation",
        question: "Have you reached out to your User and conducted a meeting?",
      },
      {
        label: "Co-creation",
        question: "Is the User involved in the project? How?",
      },
      {
        label: "Follow-up",
        question:
          "Does the User feel involved in the project? Conduct another meeting or administer a survey.",
      },
      {
        question:
          "Out of all the voices heard in designing with the User are you possibly leaving anyone out?",
      },
    ],
    resources: [
      {
        title: "Design With the User | Principles for Digital Development",
        href: "https://digitalprinciples.org/principle/design-with-the-user/",
      },
      {
        title: "FIRE Framework Layout",
        href: "https://docs.google.com/document/d/1YANkLGuVjMbZzCjkyjj_xygvEJYvPsCdM2YNOwmeki4/edit",
      },
    ],
    caseStudies: [
      {
        heading: "Customer Journey Mapping",
        eyebrow: "Case study",
        citationPrefix: "Grocki, M. (2014). ",
        linkLabel: "How to create a Customer Journey Map",
        linkHref: "https://www.youtube.com/watch?v=mSxpVRo3BLg&t=175s",
        citationSuffix: ", UX Mastery, YouTube.",
        description:
          "In this short video, Megan Grocki details the step-by-step process of thinking through customer journey mapping. While the resource uses a market, for-profit driven example, the same process is useful to explore user experience for developing project deliverables.",
        embedUrl: "https://www.youtube.com/embed/mSxpVRo3BLg?start=175",
        embedTitle: "How to Create a Customer Journey Map",
      },
      {
        heading: "Empathy Mapping Resources",
        eyebrow: "Video guide",
        linkLabel: "What is an Empathy Map?",
        linkHref: "https://www.youtube.com/watch?v=QwF9a56WFWA",
        citationSuffix: ", PlaybookUX, YouTube.",
        description:
          "This video by PlaybookUX provides a guide to empathy mapping strategies in order to understand and later be able to build a relationship with the recipients of the project.",
        embedUrl: "https://www.youtube.com/embed/QwF9a56WFWA",
        embedTitle: "What is an Empathy Map?",
      },
      {
        heading: "Design Thinking MIT",
        eyebrow: "Video case study",
        citationPrefix: "Altitude (2017). ",
        linkLabel: "Design Thinking Video from MIT and Altitude",
        linkHref: "https://www.youtube.com/watch?v=kq2kd3CXi1o",
        citationSuffix: ", YouTube.",
        description:
          "This resource takes an inside journey through MIT and Altitude’s process of designing a functional walker for the elderly. It gives a good look at the interview and review process with the very demographic the product is intended for. By interacting one-on-one with potential consumers, Altitude and MIT make sure that the product truly suits their needs. Though ethical development projects may have different needs and aims than companies with a for-profit mission, we can use some of the same considerations that help involve the consumer as for-profit and industry-driven products, because in the end, we are designing a product or service that should be functional and something people feel ownership of and want to use.",
        embedUrl: "https://www.youtube.com/embed/kq2kd3CXi1o",
        embedTitle: "Design Thinking Video from MIT and Altitude",
      },
    ],
  },
  {
    slug: "ecosystem",
    number: "02",
    path: "/ethics-of-innovation/ecosystem",
    title: "Understand the Existing Ecosystem",
    heroPrimary: "Existing",
    heroEmphasis: "Ecosystems",
    img: "/assets/images/existingecosystems.png",
    imgAlt: "Understand the Existing Ecosystem illustration",
    cardSummary:
      "Ecosystems are the sum of many factors such as culture, economy, political environment, and infrastructure.",
    summary:
      "Ecosystems are the sum of many factors such as culture, economy, political environment and infrastructure to name a few. A solid understanding of an ecosystem is needed to accurately assess the needs to be fulfilled and the sustainability of those solutions. The ecosystem must be understood to make sure individuals can actually access or use a tool or initiative otherwise failure and unintended consequences can occur. Since ecosystems are so fluid and complex they must be regularly analyzed.",
    checklist: [
      {
        label: "Culture",
        question:
          "Have you considered how the culture might influence your project?",
      },
      {
        label: "Gender Norms",
        question:
          "Have you considered how local and global gender norms influence your project?",
      },
      {
        label: "Political Environment",
        question:
          "Have you looked at how the local political environment might influence your project?",
      },
      {
        label: "Economy",
        question:
          "Have you accounted for how the local and global economy will impact your project?",
      },
      {
        label: "Technology Infrastructure",
        question:
          "Have you explored how the local technology infrastructure will impact how your users interact with your project? Is that technology readily available to them?",
      },
      {
        question:
          "What other projects or products already exist that are like yours?",
      },
    ],
    resources: [
      {
        title:
          "Understand the Existing Ecosystem | Principles for Digital Development",
        href: "https://digitalprinciples.org/principle/understand-the-existing-ecosystem/",
      },
      {
        title: "FIRE Framework Layout",
        href: "https://docs.google.com/document/d/1YANkLGuVjMbZzCjkyjj_xygvEJYvPsCdM2YNOwmeki4/edit",
      },
      {
        citationPrefix:
          "Fisher, J. A. et al. (2014). Understanding the relationships between ecosystem services and poverty alleviation: A conceptual framework. Ecosystem Services, vol. 7, pp. 34–45.",
        title: "https://doi.org/10.1016/j.ecoser.2013.08.002",
        href: "https://doi.org/10.1016/j.ecoser.2013.08.002",
        description:
          "This peer-reviewed paper in Ecosystem Services presents a conceptual framework for social-ecological systems science and international development. It explores access to services, payment for those services, the ability for people to benefit from them, and competition and commodification from external actors.",
      },
    ],
  },
  {
    slug: "scale",
    number: "03",
    path: "/ethics-of-innovation/scale",
    title: "Design for Scale",
    heroPrimary: "Design for",
    heroEmphasis: "Scale",
    img: "/assets/images/scale.png",
    imgAlt: "Design for Scale illustration",
    cardSummary:
      "Achieving scale requires thinking beyond a few pilot communities by determining affordability and usability across a whole region or country and enabling widespread adoption.",
    summary:
      "Achieving scale requires thinking beyond a few pilot communities by determining affordability and usability when rationalizing a whole region or country and formulating decisions that enable widespread adoption in the future. This should be considered at the beginning of the design process in order to ensure that your project can be easily expanded to new users, regions, and/or markets. The initiative or project must have a local impact and meet user needs.",
    checklist: [
      {
        question: "Have you planned and designed for scale from the start?",
      },
      {
        question:
          "Have you developed a definition for scale for your project or initiative?",
      },
      {
        question:
          "Is your design simple and flexible in the case where changes are needed?",
      },
      {
        question:
          "Is there an agreed-upon definition of important goals and models?",
      },
      {
        question:
          "Are there any possible partners who might be able to aid the project?",
      },
      {
        question:
          "Is this implementation feasible considering project funding?",
      },
      {
        question:
          "Is the initiative plan and approach fully thought through and considered by multiple parties?",
      },
    ],
    resources: [
      {
        title: "Design for Scale | Principles for Digital Development",
        href: "https://digitalprinciples.org/principle/design-for-scale/",
      },
      {
        title: "Scaling Design as the Company Grows | by Ian Armstrong",
        href: "https://uxplanet.org/scaling-design-as-the-company-grows-e99af38f9e8d",
      },
    ],
    caseStudies: [
      {
        heading: "WHO mHealth MAPS Toolkit",
        eyebrow: "Case study",
        linkLabel:
          "Launch of mHealth toolkit to help innovators scale up projects for reproductive, maternal, newborn, child and adolescent health",
        linkHref:
          "https://www.who.int/reproductivehealth/topics/mhealth/maps-toolkit/en/",
        description:
          "The case study above applied this design principle of designing for scale by allowing for their project to be readily expandable to new users and regions. This study applies the research to real-world applications that can be interpreted by all users.",
      },
    ],
  },
  {
    slug: "sustainability",
    number: "04",
    path: "/ethics-of-innovation/sustainability",
    title: "Build for Sustainability",
    heroPrimary: "Build for",
    heroEmphasis: "Sustainability",
    img: "/assets/images/sustainability.png",
    imgAlt: "Build for Sustainability illustration",
    cardSummary:
      "Building for sustainability allows project planners to maximize long-term impact by maintaining user and stakeholder support even through funding interruptions.",
    summary:
      "Building for sustainability allows project planners to maximize long-term impact by maintaining user and stakeholder support and ensuring that user and stakeholder contributions continue even in the case of a loss of funding or other interruptions. The ultimate goal of building a sustainable program or platform is to achieve not only a long-term impact but also a positive impact. Projects built for sustainability are more likely to be ingrained in policies and institutionalized by an organization, company, or local government.",
    checklist: [
      {
        question:
          "Have you planned and built for sustainability from the start?",
      },
      {
        question: "Is there an agreed-upon definition of sustainability?",
      },
      {
        question:
          "Is the implementation adaptable to the user as their needs and the context changes?",
      },
      {
        question: "Have you identified a sustainable business model?",
      },
      {
        question:
          "Does this implementation engage any governmental or non-governmental organizations to plan for continued success?",
      },
      {
        question:
          "Are you competing with other organizations? If so, collaborate instead in order to identify the best approach with the greatest impact.",
      },
    ],
    resources: [
      {
        title: "Build for Sustainability | Principles for Digital Development",
        href: "https://digitalprinciples.org/principle/build-for-sustainability/",
      },
      {
        title: "Structuring sustainability science",
        href: "https://link.springer.com/article/10.1007/s11625-010-0117-x",
      },
    ],
    caseStudies: [
      {
        heading: "WHO mHealth MAPS Toolkit",
        eyebrow: "Case study",
        linkLabel:
          "WHO mHealth Assessment and Planning for Scale (MAPS) Toolkit",
        linkHref:
          "https://www.who.int/reproductivehealth/topics/mhealth/maps-toolkit/en/",
        description:
          "This case study incorporates the design principle of building for sustainability by showcasing the exact support and contributions needed from stakeholders. It allows users to clearly understand the ultimate goal of their research and its continuous impact.",
      },
    ],
  },
  {
    slug: "data",
    number: "05",
    path: "/ethics-of-innovation/data",
    title: "Be Data Driven",
    heroPrimary: "Be Data",
    heroEmphasis: "Driven",
    img: "/assets/images/datadriven.png",
    imgAlt: "Be Data Driven illustration",
    cardSummary:
      "It is essential for project managers to utilize quality data in making informed decisions that will impact their final product.",
    summary:
      "It is essential for project managers to utilize quality data in making informed decisions that will impact their final product. Data allows for less risk in projects succeeding as data can be used as an indicator of how successful a product may turn out. There are many different ways project managers can utilize data, including decision making, project surveillance and review, research, and operations management.",
    checklist: [
      {
        question:
          "Are there charts or graphs that are easy to interpret and accessible?",
      },
      {
        question:
          "Does the data associated with the implementation comply with international norms and standards?",
      },
      {
        question:
          "Is the data collected respectful to all individuals’ personal identity?",
      },
      {
        question:
          "Does this implementation make use of existing data to provide background or a base for future research?",
      },
    ],
    resources: [
      {
        title: "Data-Driven Decision Making: The Engine of Accountability",
        href: "https://www.jstor.org/stable/42732442?seq=1#metadata_info_tab_contents",
      },
      {
        title:
          "Data Science and its Relationship to Big Data and Data-Driven Decision Making",
        href: "https://www.liebertpub.com/doi/pdfplus/10.1089/big.2013.1508",
      },
      {
        title: "Data-Driven Decision Making: A Primer for Beginners",
        href: "https://www.northeastern.edu/graduate/blog/data-driven-decision-making/",
      },
    ],
  },
  {
    slug: "standards",
    number: "06",
    path: "/ethics-of-innovation/standards",
    title: "Use Open Standards",
    heroPrimary: "Use Open",
    heroEmphasis: "Standards",
    img: "/assets/images/openstandards.png",
    imgAlt: "Use Open Standards illustration",
    cardSummary:
      "Using open-source material can prevent unnecessary work and resource usage while still providing meaningful results.",
    summary:
      "Collaboration can really benefit projects in finding new information that was not previously available as well as getting different perspectives on a topic. Using open-source material can prevent unnecessary work and resource usage while still providing meaningful results. Money and time that would otherwise be wasted on researching already researched fields can instead be used elsewhere when using open-source information, resulting in maximizing resource usage.",
    checklist: [
      {
        question:
          "Do all parts, including the original coding, have the ability to be viewed, copied, and modified by anyone viewing?",
      },
      {
        question:
          "Does the open data respect privacy and security concerns and standards?",
      },
      {
        question:
          "Is the implementation up to date with current technological abilities?",
      },
      {
        question:
          "Is this implementation restrictive in any manner? How can this be combated?",
      },
    ],
    resources: [
      {
        title:
          "Open Standards, Open Source, and Open Innovation: Harnessing the Benefits of Openness",
        href: "https://files.eric.ed.gov/fulltext/ED502318.pdf",
      },
    ],
  },
  {
    slug: "reuse",
    number: "07",
    path: "/ethics-of-innovation/reuse",
    title: "Reuse and Improve",
    heroPrimary: "Reuse and",
    heroEmphasis: "Improve",
    img: "/assets/images/reuse.png",
    imgAlt: "Reuse and Improve illustration",
    cardSummary:
      "Think before you innovate. Sharing tools, ideas, and lessons across teams prevents duplication, saves resources, and leads to stronger, more user-centered solutions.",
    summary:
      "Think before you innovate. Reusing and improving means looking for existing tools, methods, data, and lessons learned before building from scratch. By adapting proven solutions to local needs and sharing improvements back with the community, development teams prevent duplication, conserve limited resources, and deliver stronger, more user-centered outcomes.",
    checklist: [
      {
        label: "Landscape Scan",
        question:
          "Have you searched for existing open tools, frameworks, or local initiatives that already address part of this need?",
      },
      {
        label: "Adaptation",
        question:
          "Can an existing solution be modified and improved for your community rather than rebuilt from scratch?",
      },
      {
        label: "Modularity",
        question:
          "Is your work structured and documented so other practitioners can reuse or extend components?",
      },
      {
        label: "Sharing Back",
        question:
          "Have you planned how lessons learned, improvements, and documentation will be shared with peer teams?",
      },
    ],
    resources: [
      {
        title: "Share, Reuse and Improve | Principles for Digital Development",
        href: "https://digitalprinciples.org/principles/share-reuse-and-improve/",
        description:
          "Official guidance from the Principles for Digital Development on discovering, adapting, and contributing back to shared digital public goods.",
      },
    ],
  },
  {
    slug: "privacy",
    number: "08",
    path: "/ethics-of-innovation/privacy",
    title: "Address Privacy & Security",
    heroPrimary: "Address Privacy",
    heroEmphasis: "& Security",
    img: "/assets/images/privacy.png",
    imgAlt: "Address Privacy and Security illustration",
    cardSummary:
      "Considering the privacy and security of users ensures that people are protected from privacy violations during project implementation.",
    summary:
      "Considering the privacy and security of users is ensuring that users are safe from privacy violations during project implementations. If the project collects information from users, it is best to minimize its collection while also clearly notifying stakeholders that their information might be collected during the implementation and maintenance of a project. This allows users to make an informed decision as to whether they wish to give their information to an organization. Ultimately, projects are made to serve their users. A salient aspect of serving users best includes defending their privacy by securing their data and minimizing collection.",
    checklist: [
      {
        label: "Transparency",
        question:
          "Is this implementation transparent in how we will protect the data of our users?",
      },
      {
        label: "Interests",
        question:
          "Is this implementation in the best interest of those who are involved with it?",
      },
      {
        label: "Analysis",
        question:
          "Has there been a risk-benefit analysis of the new implementation? Is it positive or negative?",
      },
      {
        label: "Security",
        question:
          "Does this implementation minimize the collection of personal information?",
      },
      {
        label: "Awareness",
        question:
          "Have the stakeholders been informed on how their data will be used?",
      },
    ],
    resources: [
      {
        title:
          "Address Privacy & Security | Principles for Digital Development",
        href: "https://digitalprinciples.org/principle/address-privacy-security/",
      },
      {
        title: "Open data depends on open standards",
        href: "https://www.govtech.com/data/the-success-of-open-data-depends-on-open-standards.html",
      },
    ],
    caseStudies: [
      {
        heading: "IDEO Asili Project",
        eyebrow: "Case study",
        linkLabel: "Design Kit: Asili Project Case Study",
        linkHref: "https://www.designkit.org/case-studies/6",
        description:
          "In the Asili Project, the team addressed privacy and security by being transparent about their project with community members. The project minimized the collection of information to key details surrounding the project and ensured that the outcome would be in the best interest of the community members only.",
      },
    ],
  },
  {
    slug: "collaboration",
    number: "09",
    path: "/ethics-of-innovation/collaboration",
    title: "Be Collaborative",
    heroPrimary: "Be",
    heroEmphasis: "Collaborative",
    img: "/assets/images/collaborative.png",
    imgAlt: "Be Collaborative illustration",
    cardSummary:
      "Being collaborative requires project managers to communicate and share with peer organizations, stakeholders, and related government agencies.",
    summary:
      "Being collaborative requires project managers to communicate and share with peer organizations, stakeholders, and related government agencies. In the development world, everyone is working toward bettering the global condition, so collaborating with other interested parties helps to further and inform projects. Collaboration overlaps with using open standards, reusing and improving, and understanding the environment. Using open data and research makes open collaboration seamless. In order to collaborate effectively, toolkit users must plan collaboration from the beginning, taking into account what stakeholders and organizations already exist in the realm and assessing the reusable progress already made.",
    checklist: [
      {
        label: "Documentation",
        question:
          "Is the planning, coding, and framework documented for necessary parties to view?",
      },
      {
        label: "Support",
        question:
          "Does this implementation allow local organizations to support each other and work together if needed?",
      },
      {
        label: "Reference",
        question: "Does the implementation reference other resources?",
      },
      {
        label: "Awareness",
        question:
          "Does the collaboration incite awareness and advocate for its initiatives?",
      },
    ],
    resources: [
      {
        title: "Be Collaborative | Principles for Digital Development",
        href: "https://digitalprinciples.org/principle/be-collaborative/",
      },
      {
        title: "Making Collaboration Work | Cathy Rebock",
        href: "http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.882.5268&rep=rep1&type=pdf",
      },
    ],
  },
];

export function getPrincipleBySlug(
  slug: DigitalPrincipleDetail["slug"],
): DigitalPrincipleDetail {
  const found = DIGITAL_PRINCIPLES.find((item) => item.slug === slug);
  if (!found) {
    throw new Error(`Unknown digital principle slug: ${slug}`);
  }
  return found;
}

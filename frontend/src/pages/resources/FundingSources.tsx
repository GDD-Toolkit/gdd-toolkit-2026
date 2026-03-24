import { useMemo, useState } from "react";
import { motion, easeOut } from "framer-motion";
import "./FundingSources.css"; 

type Grant = {
  id: string;
  title: string;
  amount: string;
  summary: string;
  timePeriod: string;
  eligibility: string;
  pastAwards: string;
  tags?: string[];
};

const bannerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOut } },
};

{/* TO SEARCH THROUGH GRANTS, LOOK AT THE TITLE*/}
const grants: Grant[] = [
  {
    id: "accountability",
    title: "Global Partnership For Social Accountability (GPSA)",
    amount: "Grant: 400,000–$500,000/yr",
    summary:
      "GPSA aims to “expand opportunities for civil society to work with governments to solve development problems and fight poverty’ by funding “social accountability projects”",
    timePeriod: "3-4 Year Time Period",
    eligibility: "CSOs, which include: Non-government organizations, mot-for-profit media organizations; Charitable organizations, faith-based organizations, professional organizations, labor unions, workers’ organizations, associations of elected local representatives, foundations and policy development research institutions",
    pastAwards: "Since the start of GPSA, they have provided 49 grants in 32 countries. Some examples include: Center for Health Policies and Studies (Moldova); Africa Freedom of Information Centre (Uganda); Yayasan Wahana Visi Indonesia (Indonesia); Concern Universal Mozambique (Mozambique)",
  },
  {
    id: "ACLS Extension",
    title: "ACLS: Digital Extension Grants",
    amount: "Grant: < $150,000",
    summary:
      "Funding is to enhance digital projects, expand reach, and support scholars at all stages, promoting inclusion and sustainability in humanistic inquiry.",
    timePeriod: "12-18 Months",
    eligibility: "Projects have to be organized by a higher education institution in the U.S. The main investigator of the project must be a humanities/humanistic social sciences scholar. A project must have already completed the start-up or prototyping phase of development",
    pastAwards: "Not Specified",
  },
  {
    id: "Marr-Munning",
    title: "The Marr-Munning Trust",
    amount: "Not Specified",
    summary:
      "The Marr-Munning Trust has a goal of fighting poverty in Sub-Saharan Africa, Indian Subcontinent, and SouthEast Asia through education and livelihood",
    timePeriod: "Applications are only accepted for 3 months each year. The submission portal will open in April of 2022",
    eligibility: "Must be a charity or not-for-profit organization in Sub-Saharan Africa, Subcontinent, and SouthEast Asia with an income between £25,000 and £1,000,000",
    pastAwards: "They have passed 65 grants with awards totalling over £1,000,000. Able Child Africa (Uganda); Sabre Trust (Ghana); See Beyond Borders (Cambodia); Marr-Munning Ashram (India)",
  },
  {
    id: "USAID Gblobal Research",
    title: "USAID Global Health BAA For Research And Development",
    amount: "Not Specified",
    summary:
      "USAID invites organizations and companies to collaborate on innovative, practical, and cost-effective interventions to address global health issues, focusing on developing countries’ health outcomes.",
    timePeriod: "Visit site",
    eligibility: "Unrestricted",
    pastAwards: "Not Specified",
  },
  {
    id: "USAID Foreign",
    title: "USAID Foreign Assistance Programs Overseas",
    amount: "Grant: $10,300,000 total",
    summary:
      "The Foreign Assistance Program supports long-term economic growth, U.S. foreign policy objectives, and global health through economic growth, agriculture, trade, global health, democracy, conflict prevention, and humanitarian assistance.",
    timePeriod: "Issued for up to a 5 year period. Funded on a yearly basis ",
    eligibility: "This grant is open to anyone, however if the applicant has never received a grant from USAID may be require to provide the following with their application: Organization Chart, Copies of applicable policies and procedures Copies of the applicant’s audited financial statements for the previous 3 year period, which have been audited by a CPA or other auditor satisfactory to USAID",
    pastAwards: "Not Specified",
  },
  {
    id: "GIF",
    title: "Global Innovation Fund (GIF)",
    amount: "Grant: $50,000-$15,000,000",
    summary:
      "GIF invests in large-scale innovations with significant social impact, including new business models, policies, technologies, and behavioral insights for developing countries’ poor.",
    timePeriod: "6-9 months to decide on application ",
    eligibility: "GIF accepts applications in any sector in any developing country. Any type of organization may apply, including social enterprises, for-profit companies, non-profit organizations, government agencies, international organizations, and research facilities in any countr. However, not all projects are applicable with GIF’s goals. Instead, they look for ideas with the greatest potential to better the lives of those in poverty.",
    pastAwards: "Educate! (Uganda), $609,674 awarded to this program; Valid Nutrition (Malawi), granted over $100,000 to this program; Lively Minds (Ghana), awarded over $4,000,000 to this organization; EM3 (India), granted over $8,000,000 to this program ",
  },
  {
    id: "IDRC",
    title: "International Development Research Centre (IDRC)",
    amount: "Grant: CAD $42,033 - CAD $48,659",
    summary:
      "IDRC supports high-quality research, global knowledge sharing, and alliance mobilization for sustainable and inclusive world, as part of Canada’s foreign affairs and development efforts.",
    timePeriod: "Visit site for deadline details",
    eligibility: "IDRC awards grants to programs that intend to promote climate-resilient food systems, global health, education and science, democratic and inclusive governance, and sustainable and inclusive economies in developing countries",
    pastAwards: "Not Specified",
  },
  {
    id: "OPEC International Dev",
    title: "The OPEC Fund For International Development",
    amount: "Grant: < 50% of proposed amount",
    summary:
      "The organization collaborates with developing country partners and the international development community to promote economic growth and social progress in low- and middle-income nations worldwide.",
    timePeriod: "Applications can be submitted at any time",
    eligibility: "Any government or non-government body, including co financing partners, private sector entities, research institutes, UN Agencies, and international NGOs. Visit grant application from site for more",
    pastAwards: "Not Specified",
  },
  {
    id: "NEH Higher Education",
    title: "National Endowment for the Humanities (NEH): Institutes for Higher Education Faculty",
    amount: "Grant: < $235,000",
    summary:
      "NEH Institutes are professional development programs that bring together higher education faculty from across the nation to enhance their understanding of significant humanities topics and enhance their scholarship and teaching capacity.",
    timePeriod: "Visit site for deadline details",
    eligibility: "Native American tribal governments (federally recognized, private institutions of higher education, city or township governments, special district governments, county governments, public and state controlled institutions of higher education, state governments, nonprofits with a 501(c)(3) status with the IRS",
    pastAwards: "Since the start of NEH in 1965, it has awarded greater than $5 billion for humanities projects through over 64,000 grants. Partnerships with the University of Hawaii, Honolulu, and the American Council of the Blind and Helen Keller National Center. Utah Community Preservation program. Creation of a digital archive at Capital Community College",
  },
  {
    id: "NEH Digital Humanities",
    title: "National Endowment for the Humanities (NEH): Digital Humanities Advancement Grants",
    amount: "Grant: $50,000-$350,000",
    summary:
      "Visit site for deadline details",
    timePeriod: "Applications can be submitted at any time",
    eligibility: "Any government or non-government body, including co financing partners, private sector entities, research institutes, UN Agencies, and international NGOs. Visit grant application from site for more",
    pastAwards: "Since the start of NEH in 1965, it has awarded greater than $5 billion for humanities projects through over 64,000 grants. Partnerships with the University of Hawaii, Honolulu, and the American Council of the Blind and Helen Keller National Center. Utah Community Preservation program. Creation of a digital archive at Capital Community College",
  },
  {
    id: "Addax Oryx",
    title: "The Addax And Oryx Foundation",
    amount: "Grant: Not Specified",
    summary:
      "“To fund focused, high-impact projects with a clear beginning, end and exit strategy, run by small organizations that have little or no access to large funders.”",
    timePeriod: "Visit site for deadline details",
    eligibility: "A not-for-profit, non-governmental organization ",
    pastAwards: "“Organic school farm (DRC), capacity building for frontline healthcare workers (Kenya), sustainable development of two rural communities (Senegal), improved nutrition (Mozambique), sustainable timber production (Tanzania)”",
  },
  {
    id: "UNICEF Innovation",
    title: "UNICEF Innovation Fund",
    amount: "Grant: $100,000 equity-fee",
    summary:
      "The fund aims to generate self-sustaining innovation projects through small grants and venture capital investments, focusing on tech startups addressing child online safety solutions.",
    timePeriod: "Visit site for deadline details",
    eligibility: "Private Tech startup companies (varies based on open grants)",
    pastAwards: "I-Stem: AI-powered platform for students with disabilities (India), Elsa: AI-powered Pediatric Health Assistance Tool (Tanzania), OTTAA Project: AI Algorithms for Assistive Communications (Chile), Skills for girls: Nano-satellites program in Kazakhstan",
  },
  {
    id: "Lawrence",
    title: "The Lawrence Foundation",
    amount: "Grant: $5,000-$10,000",
    summary:
      "The Lawrence Foundation is a private family foundation focused on making grants to support environmental, human services and other causes.",
    timePeriod: "Visit site for deadline details",
    eligibility: "Be tax-exempt under Section 501(c)(3) of the Internal Revenue Service Code or have a fiscal sponsor that has 501(c)(3) status and provides written authorization confirming its willingness to act as the fiscal sponsor",
    pastAwards: "The Nature Conservancy, American Red Cross – International Response Fund, International Medical Corps, American Friends Service Committee, The Salvation Army",
  },
  {
    id: "GDA",
    title: "USAID Global Development Alliance (GDA)",
    amount: "Grant Amount Varies By Year",
    summary:
      "The Global Development Alliance (GDA) business model enables public-private alliances (PPAs) to execute activities that promote international development goals.",
    timePeriod: "Funded on a 12-month basis",
    eligibility: "U.S. and non-U.S. Non-Governmental Organizations, U.S. and non-U.S. private businesses, foundations, business and trade associations, international organizations, U.S. and non-U.S. colleges and universities, U.S. cities and states, other U.S. Government agencies, civic groups, other donor governments, host country governments, regional organizations, host country parastatals, individual and group philanthropies and funds etc",
    pastAwards: "Not specified",
  },
  {
    id: "ICB",
    title: "USAID Institutional Capacity Building (ICB)",
    amount: "Grant Amount Not Specified",
    summary:
      "“To strengthen the capacity of new and experienced Food for Peace Title II Partners, both to plan and implement effective food security programs which reduce vulnerability of food insecure populations, including in emergency situations.”",
    timePeriod: "Assistance is awarded quarterly, funding is available for up to five years",
    eligibility: "Private nonprofit institution/organization (includes institutions of higher education and hospitals), Other private institutions/organizations",
    pastAwards: "Not Specified",
  },
  {
    id: "IMAG",
    title: "International Market Access Grant (IMAG)",
    amount: "Grant: $10,000/ExporTech Applicant",
    summary:
      "Provides funding to support a company’s specific export development and deployment strategy with WEDC’s international staff providing technical assistance. Wisconsin companies are able to get reimbursed for specific expenses related to projects that will increase their advertising in the international market",
    timePeriod: "Apply by July 1st",
    eligibility: " Companies that have completed ExporTech training. Companies that are interested in digital design ",
    pastAwards: "Partnered with the Collaborative Market Access Grant (CMAG)",
  },
  {
    id: "Baltimore",
    title: "Baltimore Community Foundation",
    amount: "Grant: $30M Total",
    summary:
      "To strengthen public schools and neighborhoods with products and services they need and to strengthen community engagement. To highlight organizations that are making an impact and support them more.",
    timePeriod: "Applications are accepted on a rolling basis, proposals receive a decision within three months",
    eligibility: "Donors and organizations that are already making a huge impact. Must be in Baltimore County or residents in Baltimore",
    pastAwards: "Granted more than $30 million to more than 1,500 nonprofit organizations in 2020.",
  },
  {
    id: "Raftelis",
    title: "Raftelis Leadership Scholarship",
    amount: "Grant: $2,500,000",
    summary:
      "The grant supports reproductive justice organizations led by communities of color through grants, voter education, grassroots organizing, technology access, data tracking, and networking.",
    timePeriod: "July 19,2021 and each grant is eligible for 36 months",
    eligibility: "Any organization, Non-profits, Voter education, and Companies involved in data tracking",
    pastAwards: "Increased charitable non-profit organizations",
  },
  {
    id: "MHAA Heritage",
    title: "MHAA: Maryland Heritage Areas Program",
    amount: "Grant: $50,000/$100,000 For Non Capital/Capital Projects",
    summary:
      "This grant provides matching grants to nonprofit organizations and government programs for projects within Heritage Areas. These grants support historical, cultural, natural resources projects. ",
    timePeriod: "Visit site for deadline details",
    eligibility: "Projects that have a heritage tourism component. Be located within the boundaries of a certified Heritage Area. Non profit organizations, Local jurisdictions, and State and federal government agencies",
    pastAwards: "Opened the Maryland Heritage Areas Program through the Maryland Heritage Areas Authority in cause of success and more organizations being created",
  },
  {
    id: "William Flora Groundswell Fund",
    title: "William and Flora Hewlett Foundation: Groundswell Fund",
    amount: "Grant: $5,000",
    summary:
      "Raftelis offers two leadership scholarships to either undergraduate or graduate students interested in a consulting career. Students who are interested in becoming problem solvers for local governments and municipal water utilities ",
    timePeriod: "Visit site for deadline details",
    eligibility: "Undergraduate or graduate students studying business, finance, communication, public affairs, economics, marketing and government relations",
    pastAwards: "Not Specified",
  },
  {
    id: "Marketing/Public Relations",
    title: "Marketing/Public Relations Scholarship",
    amount: "Grant: $1,000",
    summary:
      "Digitalwise media’s plan is to give back to the community through their own bi annual scholarship program",
    timePeriod: "Visit site for deadline details",
    eligibility: "Students interested in marketing, public relations, communications, journalism, digital media and website design and development ",
    pastAwards: "Not Specified",
  },
  {
    id: "Digital Marketing Workforce",
    title: "Digital Marketing Workforce Institute Scholarship",
    amount: "Grant: $1,000",
    summary:
      "This scholarship was created to benefits students to become more comfortable with new content production techniques ",
    timePeriod: "Visit site for deadline details",
    eligibility: "Must be 18, Legal US citizen,  household income has to be less or equal to $30,000 & Proof of Income",
    pastAwards: "Not Specified",
  },
  {
    id: "International Foodservice",
    title: "International Foodservice Editorial Council Scholarship",
    amount: "Grant: > $6,000",
    summary:
      "The International Foodservice Editorial Council (IFEC) provides scholarships annually to students with experience or education in the combination of food/foodservice and communication arts.",
    timePeriod: "Visit site for deadline details",
    eligibility: "Full-time college student as of March 15th, pursuing an associate’s, bachelor’s, or master’s degree. Enrolled in an accredited U.S. post-secondary educational institution. Expected graduation date no earlier than January 1st. Demonstrated passion and preparation for a career in food/foodservice communication. Strong academic record, good character references, and financial need",
    pastAwards: "Not Specified",
  },
  {
    id: "American Bus",
    title: "American Bus Association Scholarship",
    amount: "Grant: $5,000",
    summary:
      "The American Bus Association promotes academic excellence and diversity for students interested in the motor coach travel or tour industry",
    timePeriod: "Visit site for deadline details",
    eligibility: "Undergraduate and Graduate students with GPA’s in the 3.4 or above range ",
    pastAwards: "Not Specified",
  },
  {
    id: "ABA Dibersity",
    title: "ABA Diversity Scholarship",
    amount: "Grant: $5,000",
    summary:
      "ABA Diversity Scholarship purpose is to broaden the amount of traditionally underrepresented groups in the management and operation ranks of the transportation, travel and tourism industry",
    timePeriod: "Visit site for deadline details",
    eligibility: "Undergraduate and Graduate Students",
    pastAwards: "Not Specified",
  },
  {
    id: "Boren",
    title: "Boren Scholarship",
    amount: "Grant: $25,000",
    summary:
      "The National Security Education Program offers funding for studying less commonly taught languages, with Boren Scholarships requiring students to work in the federal government for at least one year post-graduation.",
    timePeriod: "Visit site for deadline details",
    eligibility: "US Undergraduate students ",
    pastAwards: "Not Specified",
  },
  {
    id: "Enviromental",
    title: "Enviromental Sustainability",
    amount: "Grant: $7,066,000",
    summary:
      "",
    timePeriod: "Anytime Acceptance",
    eligibility: "Unrestricted (i.e., open to any type of entity above)",
    pastAwards: "Several awards: University of Utah received about $537,000 in 2025, Clemson university received about 400,000 in 2025, Drexel university received 449,000 in 2025, and Montclair state university received $200,000 in 2024",
  },
  {
    id: "Collaborative R",
    title: "Collaborative Research",
    amount: "Grant: $250,000",
    summary:
      "",
    timePeriod: "November 19th, 2025",
    eligibility: "Special district governments. Nonprofits having a 501(c)(3) status with the IRS, other than institutions of higher education. Private institutions of higher education. County governments. Public and State controlled institutions of higher education. City or township governments. Native American tribal governments (Federally recognized). State governments",
    pastAwards: "Vanderbilt received $49,000 in 2024, Michigan state university received $50,000 in 2024, and University of Notre Dame received $50,000 in 2024",
  },
  {
    id: "Collaborative Psychology Europe+",
    title: "Collaborative Research Grants (Social Psychology | Europe+)",
    amount: "Grant: $5,000",
    summary:
      "",
    timePeriod: "March 15th, 2026",
    eligibility: "Proposals must include collaboration among researchers in which at least one of the partners belongs to a country facing economic hardship or in which EASP is not well represented. Applicants must be EASP members in good standing.",
    pastAwards: "1. Shpend Voca, Anna Kende, Boglárka Nyúl — The Relationship Between Intergroup Contact and Anti-Gypsyism (Mar 12 2024). 2.Ankica Kosić — Attitudes on vaccine against COVID-19 and trust in authorities… (May 8 2024). 3. Rosandra Coladonato, Katja Elba, Emerson Do Bú — EASP grant report (listed Jul 15 2024). 4. Caterina Suitner, Kim Peters, Silvia Filippi — Collaborative Grant report (published on Dec 10, 2022) 5. Luca Andrighetto — Preliminary Collaborative Research Grant Report (published Feb 10 2020)",
  },
  {
    id: "NDEP STEM open",
    title: "NDEP STEM Open NFO",
    amount: "Grant: $10,000,000",
    summary:
      "",
    timePeriod: "Februrary 8th, 2028",
    eligibility: "Eligible applicants include: industry, non-profit institutions, institutions of higher education, state and/or local educational agencies, or consortia of such institutions and/or industry. Foreign entities will not be considered",
    pastAwards: "Not Specified",
  },
  {
    id: "FAA",
    title: "FAA Aviation Research Grants Program",
    amount: "Grant: $6,000,000",
    summary:
      "",
    timePeriod: "September 7th, 2027",
    eligibility: "Private institutions of higher education. Public and state-controlled institutions of higher education. Nonprofits having a 501(c)(3) status with the IRS, other than institutions of higher education",
    pastAwards: "The FAA awarded 27 research grants totaling about $9.9 million in FY 2024.The University of Cincinnati received $525,165 in 2020, The University of Michigan received $376,000 in 2020, Drexel University received $350,000 in 2020, Embry-Riddle Aeronautical University received $186,500 in 2020, George Mason University received $600,000 in 2018, The University of Oklahoma received $145,495 in 2018, The Medical College of Wisconsin received $795,234 in 2017, The University of Washington received $400,000 in 2017",
  },
  {
    id: "Biological Reproductive",
    title: "Biological Testing Facility for Contraception & Reproductive Health",
    amount: "Not Specified",
    summary:
      "",
    timePeriod: "Janurary 5th, 2026",
    eligibility: "Native American tribal organizations (other than Federally recognized tribal governments), City or township governments, Special district governments, For profit organizations other than small businesses, Others (see text field entitled 'Additional Information on Eligibility' for clarification), Nonprofits having a 501(c)(3) status with the IRS, other than institutions of higher education, County governments, Public and State controlled institutions of higher education, Private institutions of higher education, Native American tribal governments (Federally recognized), Nonprofits that do not have a 501(c)(3) status with the IRS, other than institutions of higher education, Independent school districts, Public housing authorities/Indian housing authorities, State governments, Small businesses",
    pastAwards: "They have passed several grants and service awards to places such as SRI International, Venova Technologies, and the University-affiliated research team",
  },
  {
    id: "Public Health/Epidemiological Workforce",
    title: "Strengthening and Development of Sustainable Regional Public Health and Epidemiological Workforce Capacity Through Collaboration, Program Development, and Implementation",
    amount: "Grant: $75,000,000",
    summary:
      "",
    timePeriod: "Janurary 2nd, 2026",
    eligibility: "Independent school districts, Special district governments, County governments, Public and State controlled institutions of higher education, Public housing authorities/Indian housing authorities, Native American tribal organizations (other than Federally recognized tribal governments), Nonprofits that do not have a 501(c)(3) status with the IRS, other than institutions of higher education, For profit organizations other than small businesses, Nonprofits having a 501(c)(3) status with the IRS, other than institutions of higher education, Private institutions of higher education, Native American tribal governments (Federally recognized), Small businesses, City or township governments, Unrestricted (i.e., open to any type of entity above), subject to any clarification in text field 'entitled Additional Information on Eligibility', State governments",
    pastAwards: "Not Specified",
  },
  {
    id: "U.S Embassy",
    title: "U.S. Embassy Cotonou PDS Request For Statements of Interest",
    amount: "Grant: $20,000",
    summary:
      "",
    timePeriod: "Not Specified",
    eligibility: "The Public Diplomacy Section encourages applications from U.S. and Beninese:• Registered not-for-profit organizations, including think tanks and civil society/non-governmental organizations with programming experience;• Individuals;• Non-profit or governmental educational institutions;• Governmental institutions.For-profit or commercial entities are not eligible to apply.",
    pastAwards: "Not Specified",
  },
  {
    id: "U.S Mission",
    title: "U.S Mission Turkiye Public Diplomacy Grants Program",
    amount: "N/A",
    summary:
      "",
    timePeriod: "Not Specified",
    eligibility: "Nonprofits having a 501(c)(3) status with the IRS, other than institutions of higher education Individuals. Public and State controlled institutions of higher education. Private institutions of higher education. Nonprofits that do not have a 501(c)(3) status with the IRS, other than institutions of higher education",
    pastAwards: "They have passed grants to places such as Turk Amerikan Derneği, as well as other Turkish civil society organizations working on democratic values, entrepreneurship, and cultural exchange.",
  },
  {
    id: "Formation Engineers Research",
    title: "Research In The Formation Of Engineers",
    amount: "N/A",
    summary:
      "",
    timePeriod: "Accepted Anytime",
    eligibility: "Unrestricted (i.e., open to any type of entity above)",
    pastAwards: "Ohio State University, which received approximately $318,000 for a 3-year Research in the Formation of Engineers project. American Society for Engineering Education (ASEE), which received about $435,000 to support engineering-education research efforts. Purdue University, which received roughly $350,000 for a project studying how to prepare software engineers for AI-era challenges",
  },
  {
    id: "SPARKS",
    title: "Suprring Projects To Advance Energy Research And Knowledge Swiftly (SPARKS)",
    amount: "Grant: $500,000",
    summary:
      "",
    timePeriod: "September 30th, 2029",
    eligibility: "Unrestricted (i.e., open to any type of entity above)",
    pastAwards: "Not Specified",
  },
  {
    id: "Fire",
    title: "Fire Science Innovations Through Research And Education",
    amount: "N/A",
    summary:
      "",
    timePeriod: "Februrary 10th, 2026",
    eligibility: "Unrestricted (i.e., open to any type of entity above)",
    pastAwards: "University of California, Irvine was awarded $390,000 for a FIRE project",
  },
  {
    id: "Drug Development Regulatory",
    title: "Collaboration To Enhance Drug Development And Regulatory Science",
    amount: "Grant: $5,000,000",
    summary:
      "",
    timePeriod: "Not Specified",
    eligibility: "City or township governments. Independent school districts. Public housing authorities/Indian housing authorities. Special district governments. Nonprofits having a 501(c)(3) status with the IRS, other than institutions of higher education. Private institutions of higher education. Public and State controlled institutions of higher education. Nonprofits that do not have a 501(c)(3) status with the IRS, other than institutions of higher education. Unrestricted (i.e., open to any type of entity above), subject to any clarification in text field entitled 'Additional Information on Eligibility'. State governments. County governments .Native American tribal governments (Federally recognized) .Small businesses. Native American tribal organizations (other than Federally recognized tribal governments). For profit organizations other than small businesses",
    pastAwards: "Not Specified",
  },
  {
    id: "Engineering Civil Infrastructure",
    title: "Engineering For Civil Infrastructure",
    amount: "N/A",
    summary:
      "",
    timePeriod: "Accepted Anytime",
    eligibility: "Unrestricted (i.e., open to any type of entity above)",
    pastAwards: "University of Florida, which received approximately $49,900 for an ECI research project. University of Illinois, which received roughly $839,900 for a seismic-resilient structural systems project. National Academy of Sciences, which received about $49,950 under the ECI program.",
  },
  {
    id: "Math",
    title: "Computational Mathematics",
    amount: "Grant: $1,200,000",
    summary:
      "",
    timePeriod: "December 1st, 2025",
    eligibility: "Unrestricted (i.e., open to any type of entity above)",
    pastAwards: "City College of New York (CCNY), which received an NSF Computational Mathematics grant for super-resolution algorithms. Stevens Institute of Technology, which was awarded an NSF grant for “The Computational Algebra of Representations of Categories.” Emory University, which received approximately $325,000 for a computational mathematics project.",
  },
  {
    id: "Cyberinfrastructure",
    title: "Cyberinfrastructure For Public Access and Open Science",
    amount: "Grant: $600,000",
    summary:
      "",
    timePeriod: "Accepted Anytime",
    eligibility: "Unrestricted (i.e., open to any type of entity above)",
    pastAwards: "Not Specified",
  },
  {
    id: "Infrastucture Systems/People",
    title: "Infrastructure Systems and People",
    amount: "N/A",
    summary:
      "",
    timePeriod: "Accepted Anytime",
    eligibility: "Unrestricted (i.e., open to any type of entity above)",
    pastAwards: "Not Specified",
  },
  {
    id: "Math Infrastructure",
    title: "Mathematical Sciences Infrastcuture Program",
    amount: "N/A",
    summary:
      "",
    timePeriod: "Februrary 3rd, 2026",
    eligibility: "Unrestricted (i.e., open to any type of entity above)",
    pastAwards: "Not Specified",
  },
  {
    id: "RAD",
    title: "Research and Development (RAD) Directed Energy (RD) University",
    amount: "Grant: $49,000,000",
    summary:
      "",
    timePeriod: "July 18th, 2029",
    eligibility: "Unrestricted (i.e., open to any type of entity above)",
    pastAwards: "Not Specified",
  },
  {
    id: "Human Rights",
    title: "Promoting Human Rights For Vulnerable Children In Haut-Katanga",
    amount: "N/A",
    summary:
      "",
    timePeriod: "Not Specified",
    eligibility: "Unrestricted (i.e., open to any type of entity above)",
    pastAwards: "Not Specified",
  },
  {
    id: "Human Enabling",
    title: "Continuing Human Enabling Restoring And Sustaining",
    amount: "N/A",
    summary:
      "",
    timePeriod: "Auguest 22nd, 2044",
    eligibility: "Unrestricted (i.e., open to any type of entity above)",
    pastAwards: "Not Specified",
  },
  {
    id: "Field Initiated Projects",
    title: "Field Initiated Projects Program (Development)",
    amount: "Grant: $250,000",
    summary:
      "",
    timePeriod: "December 10th, 2025",
    eligibility: "State governments. Special district governments. Private institutions of higher education. Small businesses. Nonprofits that do not have a 501(c)(3) status with the IRS, other than institutions of higher education. Native American tribal organizations (other than Federally recognized tribal governments). For profit organizations other than small businesses. Native American tribal governments (Federally recognized). County governments. Nonprofits having a 501(c)(3) status with the IRS, other than institutions of higher education. City or township governments. Public and State controlled institutions of higher education",
    pastAwards: "Not Specified",
  },
  {
    id: "Validation Emerging Technologies",
    title: "Advanced Development And Validation Of Emerging Technologies For Basic And Clinical Cancer Research (R33 Clinical Trial Not ALlowed)",
    amount: "grant: $300,000",
    summary:
      "",
    timePeriod: "April 10th, 2026",
    eligibility: "Independent school districts. Public housing authorities/Indian housing authorities. Special district governments. Native American tribal governments (Federally recognized). For profit organizations other than small businesses. State governments. Small businesses. City or township governments. County governments. Private institutions of higher education. Nonprofits having a 501(c)(3) status with the IRS, other than institutions of higher education. Public and State controlled institutions of higher education. Native American tribal organizations (other than Federally recognized tribal governments). Others (see text field entitled 'Additional Information on Eligibility' for clarification). Nonprofits that do not have a 501(c)(3) status with the IRS, other than institutions of higher education",
    pastAwards: "Jackson Laboratory, which received a grant for an emerging molecular/cellular analysis technology. Wake Forest University Health Sciences, which received a grant to develop long-read sequencing and chromatin interaction analyses of structural variants in cancer.",
  },
  {
    id: "Field Projects (Research)",
    title: "Field Initiated Projects Program (Research)",
    amount: "Grant: $250,000",
    summary:
      "",
    timePeriod: "December 12th, 2025",
    eligibility: "Public and State controlled institutions of higher education. City or township governments. Nonprofits that do not have a 501(c)(3) status with the IRS, other than institutions of higher education. Small businesses. County governments. For profit organizations other than small businesses. Special district governments. Native American tribal organizations (other than Federally recognized tribal governments). State governments. Native American tribal governments (Federally recognized). Nonprofits having a 501(c)(3) status with the IRS, other than institutions of higher education. Private institutions of higher education",
    pastAwards: "University of Illinois, Chicago, which received a grant for a “Parents Taking Action eHealth Adaptation and Pilot” project for young children with autism. North Carolina Agricultural and Technical State University (NC A&T), which received a grant for a project titled “Promoting Successful Employment Trajectories for Youth with Disabilities During School-to-Work Transition.”",
  },
  {
    id: "AHRQ",
    title: "AHRQ Mentored Research Scientist Career Development Award (K01)",
    amount: "N/A",
    summary:
      "",
    timePeriod: "November 9th, 2025",
    eligibility: "Others (see text field entitled 'Additional Information on Eligibility' for clarification). City or township governments. Independent school districts. Native American tribal governments (Federally recognized). County governments. State governments. Nonprofits that do not have a 501(c)(3) status with the IRS, other than institutions of higher education. Public and State controlled institutions of higher education. Special district governments. Private institutions of higher education. Nonprofits having a 501(c)(3) status with the IRS, other than institutions of higher education. Public housing authorities/Indian housing authorities. Native American tribal organizations (other than Federally recognized tribal governments)",
    pastAwards: "Not Specified",
  }
];

function GrantCard({ g }: { g: Grant }) {
  return (
    <article className="card">
      <header className="card-header">                              
        <div className="card-left">
          <h3 className="card-title">
            {g.title}
          </h3>
          <p className="card-summary">
            {g.summary}
          </p>
        </div>
        <div className="card-right">
          <div className="card-amount">
            {g.amount}
          </div>
          <div className="card-tags">
            {g.tags?.join(" · ")}
          </div>
        </div>
      </header>

      <div className="card-details">
        <details className="details-block">
          <summary>
            Time Period
          </summary>
          <div>
            {g.timePeriod ?? "Not specified"}
          </div>
        </details>

        <details className="details-block">
          <summary>
            Eligibility
          </summary>
          <div>
            {g.eligibility ?? "Not specified"}
          </div>
        </details>

        <details className="details-block">
          <summary>
            Past Awards
          </summary>
          <div>
            {g.pastAwards ?? "Not specified"}
          </div>
        </details>
      </div>
    </article>
  );
}

export default function FundingSources() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return grants;
    return grants.filter((g) => {
      return (
        g.title.toLowerCase().includes(q) ||
        g.summary.toLowerCase().includes(q) ||
        (g.tags && g.tags.join(" ").toLowerCase().includes(q))
      );
    });
  }, [query]);

  return (
    <div className="page">
        <header className="mission-banner">
            <motion.h1
                className="mission-title"
                initial="hidden"
                animate="visible"
                variants={bannerVariants}
            >
                Funding Sources
            </motion.h1>
        </header>
      <div className="page-inner">
        <div className="header-box">   
                <h1 className="page-title">
                    Funding Programs
                </h1>
                <p className="page-subtitle">
                    Browse and Search Grants Using Their Names to Explore Eligibility, Past Awards, Total Grants, and More!
                </p>
                <div className="search-wrapper">
                    <input
                        aria-label="Search grants"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search Funding Sources..."
                        className="search-input"
                    />
                </div>
        </div>   
        <section className="grid">
          {filtered.map((g) => (
            <GrantCard key={g.id} g={g} />
          ))}
        </section>
        <br></br>
      </div>
    </div>
  );
}
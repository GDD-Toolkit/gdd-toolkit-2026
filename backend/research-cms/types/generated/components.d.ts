import type { Schema, Struct } from '@strapi/strapi';

export interface SharedAgencyAndEmpowerment extends Struct.ComponentSchema {
  collectionName: 'components_shared_agency_and_empowerments';
  info: {
    displayName: 'agency_and_empowerment';
    icon: 'rocket';
  };
  attributes: {
    electricity_access_percentage: Schema.Attribute.Decimal;
    export_percentage_of_gdp: Schema.Attribute.Decimal;
    gdp: Schema.Attribute.Decimal;
    gdp_growth_percentage: Schema.Attribute.Decimal;
    gini_index: Schema.Attribute.Decimal;
    import_percentage_of_gdp: Schema.Attribute.Decimal;
    labor_force_participation: Schema.Attribute.Decimal;
    poverty_rate: Schema.Attribute.Decimal;
    trade_percentage_of_gdp: Schema.Attribute.Decimal;
    unemployment_rate: Schema.Attribute.Decimal;
  };
}

export interface SharedAuthor extends Struct.ComponentSchema {
  collectionName: 'components_shared_authors';
  info: {
    displayName: 'author';
    icon: 'alien';
  };
  attributes: {
    affiliation: Schema.Attribute.String;
    author_name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedCulturalFreedom extends Struct.ComponentSchema {
  collectionName: 'components_shared_cultural_freedoms';
  info: {
    displayName: 'cultural_freedom';
  };
  attributes: {
    assembly: Schema.Attribute.String;
    civil_liberties: Schema.Attribute.Integer;
    gri: Schema.Attribute.Decimal;
    official_language: Schema.Attribute.String;
    political_rights: Schema.Attribute.Integer;
    shi: Schema.Attribute.Decimal;
    type_of_government: Schema.Attribute.Text;
  };
}

export interface SharedDescriptions extends Struct.ComponentSchema {
  collectionName: 'components_shared_descriptions';
  info: {
    displayName: 'Descriptions';
  };
  attributes: {
    sub_image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    subsection: Schema.Attribute.String & Schema.Attribute.Required;
    subsection_text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface SharedEnvironmentalSustainability
  extends Struct.ComponentSchema {
  collectionName: 'components_shared_environmental_sustainabilities';
  info: {
    displayName: 'environmental_sustainability';
    icon: 'earth';
  };
  attributes: {
    average_air_temperature: Schema.Attribute.Decimal;
    co2_emissions_per_capita: Schema.Attribute.Decimal;
    ghg_emissions: Schema.Attribute.Decimal;
    paris_climate_agreement: Schema.Attribute.Boolean;
    precipitation: Schema.Attribute.Decimal;
    terrain: Schema.Attribute.Text;
  };
}

export interface SharedEquality extends Struct.ComponentSchema {
  collectionName: 'components_shared_equalities';
  info: {
    displayName: 'equality';
    icon: 'thumbUp';
  };
  attributes: {
    ethnic_diversity_rate: Schema.Attribute.Decimal;
    female_literacy_rate: Schema.Attribute.Decimal;
    gender_pay_gap: Schema.Attribute.Decimal;
    most_common_ethnic_group: Schema.Attribute.String;
  };
}

export interface SharedEthicalConsideration extends Struct.ComponentSchema {
  collectionName: 'components_shared_ethical_considerations';
  info: {
    displayName: 'ethical_consideration';
  };
  attributes: {
    accountability_responsability_description: Schema.Attribute.Text;
    accountability_responsability_score: Schema.Attribute.Integer &
      Schema.Attribute.Required;
    bias_migration_description: Schema.Attribute.Text;
    bias_mitigation_score: Schema.Attribute.Integer & Schema.Attribute.Required;
    control_oversight_description: Schema.Attribute.Text;
    control_oversight_score: Schema.Attribute.Integer &
      Schema.Attribute.Required;
    documentation_support_description: Schema.Attribute.Text;
    documentation_support_score: Schema.Attribute.Integer &
      Schema.Attribute.Required;
    ethical_failsafes_description: Schema.Attribute.Text;
    ethical_failsafes_score: Schema.Attribute.Integer &
      Schema.Attribute.Required;
    evidence_of_impact_description: Schema.Attribute.Text;
    evidence_of_impact_score: Schema.Attribute.Integer &
      Schema.Attribute.Required;
    integration_description: Schema.Attribute.Text;
    Integration_score: Schema.Attribute.Integer & Schema.Attribute.Required;
    localization_accessibility_description: Schema.Attribute.Text;
    localization_accessibility_score: Schema.Attribute.Integer &
      Schema.Attribute.Required;
    low_tech_compatbability_description: Schema.Attribute.Text;
    low_tech_compativility_score: Schema.Attribute.Integer &
      Schema.Attribute.Required;
    offline_capabilities_score: Schema.Attribute.Integer &
      Schema.Attribute.Required;
    offline_capabilties_description: Schema.Attribute.Text;
    privacy_data_ethics_description: Schema.Attribute.Text;
    privacy_data_ethics_score: Schema.Attribute.Integer &
      Schema.Attribute.Required;
    purpose_score: Schema.Attribute.Integer & Schema.Attribute.Required;
    sustainability_description: Schema.Attribute.Text;
    sustainabilty_score: Schema.Attribute.Integer & Schema.Attribute.Required;
    transparency_description: Schema.Attribute.Text;
    transparency_score: Schema.Attribute.Integer & Schema.Attribute.Required;
  };
}

export interface SharedEvaluations extends Struct.ComponentSchema {
  collectionName: 'components_shared_evaluations';
  info: {
    displayName: 'evaluations';
  };
  attributes: {
    grade: Schema.Attribute.Enumeration<['A', 'B', 'C', 'D', 'F']> &
      Schema.Attribute.Required;
    values: Schema.Attribute.Component<
      'shared.values-of-worthwhiledevelopment',
      false
    > &
      Schema.Attribute.Required;
  };
}

export interface SharedGenevaConvention extends Struct.ComponentSchema {
  collectionName: 'components_shared_geneva_conventions';
  info: {
    displayName: 'geneva_convention';
  };
  attributes: {
    participation: Schema.Attribute.Boolean;
  };
}

export interface SharedHumanRights extends Struct.ComponentSchema {
  collectionName: 'components_shared_human_rights';
  info: {
    displayName: 'human_rights';
    icon: 'walk';
  };
  attributes: {
    homelessness_count: Schema.Attribute.BigInteger;
    homelessness_rate: Schema.Attribute.Decimal;
    literacy_rate_adult: Schema.Attribute.Decimal;
    literacy_rate_youth: Schema.Attribute.Decimal;
    poverty_gap_at_3_usd_a_day: Schema.Attribute.Decimal;
    poverty_rate_at_3_usd: Schema.Attribute.Decimal;
    poverty_rate_at_povery_line: Schema.Attribute.Decimal;
  };
}

export interface SharedKeywordWorthwhileDevelopment
  extends Struct.ComponentSchema {
  collectionName: 'components_shared_keyword_worthwhile_developments';
  info: {
    displayName: 'keyword_worthwhile_development';
  };
  attributes: {
    keyword: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedLessonLearned extends Struct.ComponentSchema {
  collectionName: 'components_shared_lesson_learneds';
  info: {
    displayName: 'lesson_learned';
  };
  attributes: {
    sub_image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    subsection: Schema.Attribute.String & Schema.Attribute.Required;
    subsection_text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface SharedProjectKeywords extends Struct.ComponentSchema {
  collectionName: 'components_shared_project_keywords';
  info: {
    displayName: 'project_keywords';
  };
  attributes: {
    keywords: Schema.Attribute.Enumeration<
      [
        'User-centric',
        'Short-term',
        'Long-term',
        'Efficiency/Short-term',
        'Process Mapping',
        'Decision Making',
        'Six Sigma',
        'Quality Managment',
      ]
    >;
  };
}

export interface SharedReferences extends Struct.ComponentSchema {
  collectionName: 'components_shared_references';
  info: {
    displayName: 'references';
  };
  attributes: {
    APA_citation: Schema.Attribute.String & Schema.Attribute.Required;
    article_link: Schema.Attribute.String & Schema.Attribute.Required;
    author: Schema.Attribute.String & Schema.Attribute.Required;
    author_contact_information: Schema.Attribute.String &
      Schema.Attribute.Required;
  };
}

export interface SharedResponsibility extends Struct.ComponentSchema {
  collectionName: 'components_shared_responsibilities';
  info: {
    displayName: 'responsibility';
    icon: 'bell';
  };
  attributes: {
    control_of_corruption: Schema.Attribute.Decimal;
    geneva_convention: Schema.Attribute.Boolean;
    government_effectiveness: Schema.Attribute.Decimal;
    icc: Schema.Attribute.Boolean;
    icj: Schema.Attribute.Boolean;
    military_expenditure_percentage_of_gdp: Schema.Attribute.Decimal;
    overall: Schema.Attribute.Decimal;
    people_per_square_km: Schema.Attribute.Integer;
    political_instability: Schema.Attribute.Decimal;
    political_stability: Schema.Attribute.Decimal;
    respitory_quality: Schema.Attribute.Decimal;
    rule_of_law: Schema.Attribute.Decimal;
    voice_and_accountability: Schema.Attribute.Decimal;
  };
}

export interface SharedSdg extends Struct.ComponentSchema {
  collectionName: 'components_shared_sdgs';
  info: {
    displayName: 'sdg';
  };
  attributes: {
    sdg_value: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 17;
          min: 1;
        },
        number
      >;
    sub_value: Schema.Attribute.Component<'shared.sdg-subvalue', true>;
  };
}

export interface SharedSdgSubvalue extends Struct.ComponentSchema {
  collectionName: 'components_shared_sdg_subvalues';
  info: {
    displayName: 'sdg_subvalue';
  };
  attributes: {
    sdg_subvalue: Schema.Attribute.Integer;
  };
}

export interface SharedSpeakers extends Struct.ComponentSchema {
  collectionName: 'components_shared_speakers';
  info: {
    displayName: 'speakers';
  };
  attributes: {
    speaker: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedTeammates extends Struct.ComponentSchema {
  collectionName: 'components_shared_teammates';
  info: {
    displayName: 'teammates';
  };
  attributes: {
    member_name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedValuesOfWorthwhiledevelopment
  extends Struct.ComponentSchema {
  collectionName: 'components_shared_values_of_worthwhiledevelopments';
  info: {
    displayName: 'values_of_worthwhiledevelopment';
  };
  attributes: {
    values: Schema.Attribute.Enumeration<
      [
        'Cultural Freedom',
        'Empowerment',
        'Equality',
        'Human Rights',
        'Responsibility',
        'Sustainability',
        'Well-being',
      ]
    > &
      Schema.Attribute.Required;
  };
}

export interface SharedWellBeing extends Struct.ComponentSchema {
  collectionName: 'components_shared_well_beings';
  info: {
    displayName: 'well_being';
    icon: 'emotionHappy';
  };
  attributes: {
    density_doctors: Schema.Attribute.Decimal;
    density_nurses: Schema.Attribute.Decimal;
    homicide_rate: Schema.Attribute.Decimal;
    kidnapping_rate: Schema.Attribute.Decimal;
    life_expectancy_female: Schema.Attribute.Decimal;
    life_expectancy_male: Schema.Attribute.Decimal;
    life_expectancy_total: Schema.Attribute.Decimal;
    population: Schema.Attribute.BigInteger;
    population_growth_rate: Schema.Attribute.Decimal;
    robbery_rate: Schema.Attribute.Decimal;
    serious_assault_rate: Schema.Attribute.Decimal;
    sexual_violence_rate: Schema.Attribute.Decimal;
    trafficking_of_persons_rate: Schema.Attribute.Integer;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.agency-and-empowerment': SharedAgencyAndEmpowerment;
      'shared.author': SharedAuthor;
      'shared.cultural-freedom': SharedCulturalFreedom;
      'shared.descriptions': SharedDescriptions;
      'shared.environmental-sustainability': SharedEnvironmentalSustainability;
      'shared.equality': SharedEquality;
      'shared.ethical-consideration': SharedEthicalConsideration;
      'shared.evaluations': SharedEvaluations;
      'shared.geneva-convention': SharedGenevaConvention;
      'shared.human-rights': SharedHumanRights;
      'shared.keyword-worthwhile-development': SharedKeywordWorthwhileDevelopment;
      'shared.lesson-learned': SharedLessonLearned;
      'shared.project-keywords': SharedProjectKeywords;
      'shared.references': SharedReferences;
      'shared.responsibility': SharedResponsibility;
      'shared.sdg': SharedSdg;
      'shared.sdg-subvalue': SharedSdgSubvalue;
      'shared.speakers': SharedSpeakers;
      'shared.teammates': SharedTeammates;
      'shared.values-of-worthwhiledevelopment': SharedValuesOfWorthwhiledevelopment;
      'shared.well-being': SharedWellBeing;
    }
  }
}

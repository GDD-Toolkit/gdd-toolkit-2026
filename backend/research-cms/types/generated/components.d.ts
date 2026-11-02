import type { Schema, Struct } from '@strapi/strapi';

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

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.author': SharedAuthor;
      'shared.descriptions': SharedDescriptions;
      'shared.ethical-consideration': SharedEthicalConsideration;
      'shared.evaluations': SharedEvaluations;
      'shared.keyword-worthwhile-development': SharedKeywordWorthwhileDevelopment;
      'shared.lesson-learned': SharedLessonLearned;
      'shared.project-keywords': SharedProjectKeywords;
      'shared.references': SharedReferences;
      'shared.sdg': SharedSdg;
      'shared.sdg-subvalue': SharedSdgSubvalue;
      'shared.speakers': SharedSpeakers;
      'shared.teammates': SharedTeammates;
      'shared.values-of-worthwhiledevelopment': SharedValuesOfWorthwhiledevelopment;
    }
  }
}

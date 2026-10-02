export const evaluationPhases = [
    { id: "design", label: "Design", description: "Assess intended goals, stakeholder needs, and ethical safeguards." },
    { id: "implementation", label: "Implementation", description: "Assess delivery, participation, actual benefits, and unintended harm." },
    { id: "outcomes", label: "Outcomes", description: "Assess lasting benefits, local support, and long-term effects." },
] as const;

// Guiding questions adapted from Table 1 of projectevalnewexternal.pdf.
export const evaluationValues = [
    {
        "id": "wellbeing",
        "label": "Well-Being",
        "groups": [
            {
                "title": "Capability Expansion",
                "questions": [
                    "Does the project expand real freedoms and opportunities?",
                    "Can people do or be things they could not before?",
                    "Does it go beyond minimum survival and basic necessities?"
                ]
            },
            {
                "title": "Multidimensionality",
                "questions": [
                    "Does it address interconnected needs across health, education, security, and income?"
                ]
            },
            {
                "title": "Avoidance of Harm",
                "questions": [
                    "Does it minimize unintended negative effects?",
                    "Are risks considered and mitigated?"
                ]
            },
            {
                "title": "Depth of Impact",
                "questions": [
                    "Are improvements significant and lasting?",
                    "Does it reach vulnerable groups or only those easiest to help?"
                ]
            }
        ]
    },
    {
        "id": "equity",
        "label": "Equity",
        "groups": [
            {
                "title": "Distribution of Resources",
                "questions": [
                    "Who benefits and who does not?",
                    "Are there disparities in access to support or resources?"
                ]
            },
            {
                "title": "Structural Inequalities",
                "questions": [
                    "Does the project reduce or reinforce existing inequalities?",
                    "Does it challenge systemic barriers?"
                ]
            },
            {
                "title": "Reach",
                "questions": [
                    "Are the most affected groups involved as stakeholders?",
                    "Do benefits reach marginalized populations?"
                ]
            },
            {
                "title": "Depth",
                "questions": [
                    "Does it address root causes of inequality?",
                    "Does it meaningfully shift power and access?"
                ]
            }
        ]
    },
    {
        "id": "empowerment",
        "label": "Empowerment",
        "groups": [
            {
                "title": "Decision-Making Power",
                "questions": [
                    "Do community members participate in meaningful decisions?",
                    "Who has final authority: the community, government, donors, or outside experts?"
                ]
            },
            {
                "title": "Participation and Voice",
                "questions": [
                    "Are communities consulted during design, implementation, and evaluation?",
                    "Is participation active and direct or symbolic?"
                ]
            },
            {
                "title": "Protection of Autonomy",
                "questions": [
                    "Are community needs, privacy, and consent respected?",
                    "Are people coerced or pressured into agreement?"
                ]
            }
        ]
    },
    {
        "id": "sustainability",
        "label": "Sustainability",
        "groups": [
            {
                "title": "Climate and Ecological Protection",
                "questions": [
                    "Are natural resources and ecosystems protected?",
                    "Are long-term environmental consequences considered?"
                ]
            },
            {
                "title": "Mitigation of Environmental Degradation",
                "questions": [
                    "Are climate risks assessed and addressed?"
                ]
            },
            {
                "title": "Risk Management",
                "questions": [
                    "Are environmental risks identified and managed responsibly?",
                    "What safeguards are in place?"
                ]
            },
            {
                "title": "Long-Term Impact",
                "questions": [
                    "Does the project support environmental sustainability and resilience over time?",
                    "Could benefits today cause harm tomorrow?"
                ]
            }
        ]
    },
    {
        "id": "rights",
        "label": "Human Rights",
        "groups": [
            {
                "title": "Rights Protections",
                "questions": [
                    "Are basic rights respected?",
                    "Are marginalized groups protected from discrimination?"
                ]
            },
            {
                "title": "Freedom From Harm",
                "questions": [
                    "Could the project expose stakeholders to threats to human rights?",
                    "Are vulnerable groups safeguarded?"
                ]
            },
            {
                "title": "Adherence to Norms",
                "questions": [
                    "Does the project follow international human rights standards?"
                ]
            }
        ]
    },
    {
        "id": "culture",
        "label": "Cultural Freedoms",
        "groups": [
            {
                "title": "Protection of Identity",
                "questions": [
                    "Are different cultural practices, languages, and beliefs respected?",
                    "Does the project strengthen or weaken cultural identities?"
                ]
            },
            {
                "title": "Avoidance of Cultural Imposition",
                "questions": [
                    "Does it avoid imposing outside values or norms?",
                    "Are communities pressured to change culturally?"
                ]
            },
            {
                "title": "Inclusion of Local Knowledge",
                "questions": [
                    "Are local traditions, norms, and beliefs considered?"
                ]
            },
            {
                "title": "Involvement",
                "questions": [
                    "Are different cultural groups involved in design or implementation?",
                    "Are cultural norms respected?"
                ]
            }
        ]
    },
    {
        "id": "responsibility",
        "label": "Government Responsibility",
        "groups": [
            {
                "title": "Transparency",
                "questions": [
                    "Is information about funding, decisions, and design openly shared?",
                    "Are communities kept informed of government actions?"
                ]
            },
            {
                "title": "Accountability",
                "questions": [
                    "Who is responsible if something goes wrong?",
                    "Are they held accountable through legal structures?"
                ]
            },
            {
                "title": "Anti-Corruption",
                "questions": [
                    "Are financial flows clear and monitored?",
                    "Are checks and balances in place?",
                    "Are democratic government systems in place?"
                ]
            },
            {
                "title": "Fairness in Implementation",
                "questions": [
                    "Do elites disproportionately capture benefits?"
                ]
            }
        ]
    }
] as const;

// Boundaries in the original page overlap; the higher tier starts at 30, 60, and 80.
export const evaluationBands = [
    { label: "Poor", min: 0, range: "0–30%" },
    { label: "Developing", min: 30, range: "30–60%" },
    { label: "Good", min: 60, range: "60–80%" },
    { label: "Superior", min: 80, range: "80–100%" },
] as const;

export type EvaluationPhase = typeof evaluationPhases[number]["id"];
export type EvaluationValue = typeof evaluationValues[number]["id"];
export type EvaluationAnswer = {
    notes?: string;
    valueNotes?: Partial<Record<EvaluationValue, string>>;
    score?: string;
    rationale?: string;
};
export type EvaluationAnswers = Partial<Record<EvaluationPhase, EvaluationAnswer>>;
export type EvaluationWeights = Record<EvaluationPhase, string>;

export function parseEvaluationScore(value: string | undefined): number | null {
    if (value === undefined || value.trim() === "") return null;
    const score = Number(value);
    return Number.isFinite(score) && score >= 0 && score <= 100 ? score : null;
}

export function evaluationBand(score: number): string {
    return [...evaluationBands].reverse().find((band) => score >= band.min)!.label;
}

export function calculateEvaluation(answers: EvaluationAnswers, weights: EvaluationWeights) {
    const phases = evaluationPhases.map((phase) => ({
        ...phase, score: parseEvaluationScore(answers[phase.id]?.score),
    }));
    const parsedWeights = evaluationPhases.map((phase) => {
        const raw = weights[phase.id];
        return raw.trim() === "" ? NaN : Number(raw);
    });
    const validWeights = parsedWeights.every((weight) => Number.isFinite(weight) && weight >= 0)
        && parsedWeights.some((weight) => weight > 0);
    const ready = validWeights && phases.every((phase) => phase.score !== null);
    // Normalize first to avoid overflow with large valid relative weights.
    const largestWeight = Math.max(...parsedWeights);
    const normalizedWeights = parsedWeights.map((weight) => weight / largestWeight);
    const total = ready ? phases.reduce((sum, phase, index) => sum + (phase.score ?? 0) * normalizedWeights[index], 0)
        / normalizedWeights.reduce((sum, weight) => sum + weight, 0) : null;
    return { phases, validWeights, total };
}

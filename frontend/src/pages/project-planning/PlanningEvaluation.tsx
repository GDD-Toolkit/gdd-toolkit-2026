import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import {
    calculateEvaluation, evaluationBand, evaluationPhases, evaluationValues, parseEvaluationScore,
    type EvaluationAnswers, type EvaluationPhase, type EvaluationAnswer, type EvaluationWeights,
} from "../tools/evaluationScoring";

const phaseQuestions: Record<EvaluationPhase, string[]> = {
    design: [
        "Who are the key stakeholders, and what genuine needs does the project address?",
        "What outcomes are intended, and what activities and assumptions connect the project to those outcomes?",
        "Which values of worthwhile development are relevant, and how are they incorporated into the design?",
    ],
    implementation: [
        "How does actual delivery compare with the intended goals? Were activities completed and resources used efficiently?",
        "How did implementation respond to community needs, protect rights, and minimize harm?",
        "What negative externalities or unexpected challenges occurred? How significant were they, and did harms outweigh benefits?",
    ],
    outcomes: [
        "Did the project produce lasting institutional or behavioral change?",
        "Will benefits persist without continuing external support, and did unintended harms emerge?",
        "Do outcomes fit the local institutional, cultural, and economic context?",
        "Has the project gained legitimacy among stakeholders and policymakers?",
    ],
};

type Props = {
    phase: EvaluationPhase;
    onPhaseChange: (phase: EvaluationPhase) => void;
    answers: EvaluationAnswers;
    onAnswerChange: (phase: EvaluationPhase, answer: EvaluationAnswer) => void;
    weights: EvaluationWeights;
    onWeightChange: (phase: EvaluationPhase, weight: string) => void;
};

export default function PlanningEvaluation({ phase, onPhaseChange, answers, onAnswerChange, weights, onWeightChange }: Props) {
    const results = calculateEvaluation(answers, weights);
    const phaseIndex = evaluationPhases.findIndex((item) => item.id === phase);
    const currentPhase = evaluationPhases[phaseIndex];
    const answer = answers[phase] ?? {};
    const score = parseEvaluationScore(answer.score);
    const invalidScore = !!answer.score?.trim() && score === null;
    const updateAnswer = (patch: Partial<EvaluationAnswer>) => onAnswerChange(phase, { ...answer, ...patch });
    return (
        <div className="planning-evaluation">
            <p className="simulation-text">Work through Design, Implementation, and Outcomes in order. Use the guiding questions and evidence to judge each phase, then assign one phase score.
                Read the <a href="/projectevalnewexternal.pdf" target="_blank" rel="noopener noreferrer">evaluation methodology</a> for the full guidance.</p>
            <RadioGroup value={phase} onValueChange={(value) => onPhaseChange(value as EvaluationPhase)} aria-label="Evaluation phase" className="planning-evaluation-phases">
                {evaluationPhases.map((item, index) => (
                    <Card key={item.id} className="planning-evaluation-choice" data-selected={phase === item.id}>
                        <CardContent><label>
                            <RadioGroupItem value={item.id} />
                            <span><strong>{index + 1}. {item.label}</strong><span className="planning-evaluation-description">{item.description}</span></span>
                        </label></CardContent>
                    </Card>
                ))}
            </RadioGroup>
            <section aria-labelledby="evaluation-phase-heading">
                <h3 id="evaluation-phase-heading">{currentPhase.label}: review the evidence</h3>
                <ul className="planning-evaluation-questions">{phaseQuestions[phase].map((question) => <li key={question}>{question}</li>)}</ul>
                <label htmlFor={`phase-notes-${phase}`}>Phase findings and evidence</label>
                <textarea id={`phase-notes-${phase}`} rows={5} value={answer.notes ?? ""}
                    placeholder="Record your findings, evidence sources, benefits, harms, and uncertainties."
                    onChange={(event) => updateAnswer({ notes: event.target.value })} />
            </section>
            <section aria-labelledby="evaluation-values-heading">
                <h3 id="evaluation-values-heading">Seven values: guiding questions</h3>
                <p>Review the values relevant to this phase. Open each guide to record evidence, or explain why a value is not relevant. These notes inform your judgment; they are not automatically scored.</p>
                <div className="planning-evaluation-guides">
                    {evaluationValues.map((value) => (
                        <details key={`${phase}-${value.id}`} className="planning-evaluation-guide">
                            <summary>{value.label}</summary>
                            {value.groups.map((group) => (
                                <div key={group.title}>
                                    <h4>{group.title}</h4>
                                    <ul className="planning-evaluation-questions">{group.questions.map((question) => <li key={question}>{question}</li>)}</ul>
                                </div>
                            ))}
                            <label htmlFor={`notes-${phase}-${value.id}`}>{value.label}: evidence and observations</label>
                            <textarea id={`notes-${phase}-${value.id}`} rows={4} value={answer.valueNotes?.[value.id] ?? ""}
                                onChange={(event) => updateAnswer({ valueNotes: { ...answer.valueNotes, [value.id]: event.target.value } })} />
                        </details>
                    ))}
                </div>
            </section>
            <Card><CardContent>
                <h3>Assign the {currentPhase.label.toLowerCase()} phase score</h3>
                <p>Using the evidence above, judge how well this phase met the ethical criteria. 0% represents complete failure and 100% complete success.</p>
                <p>Poor: below 30%; Developing: 30 to below 60%; Good: 60 to below 80%; Superior: 80 to 100%.</p>
                <label htmlFor={`phase-score-${phase}`}>{currentPhase.label} score (%)</label>
                <Input id={`phase-score-${phase}`} type="number" min={0} max={100} step="any" inputMode="decimal"
                    value={answer.score ?? ""} onChange={(event) => updateAnswer({ score: event.target.value })}
                    aria-invalid={invalidScore} aria-describedby="phase-score-feedback" />
                <p id="phase-score-feedback" role="status">{invalidScore ? "Enter a score between 0 and 100." : score === null ? "Not scored yet" : `Classification: ${evaluationBand(score)}`}</p>
                <label htmlFor={`phase-rationale-${phase}`}>Reason for this score</label>
                <textarea id={`phase-rationale-${phase}`} rows={4} value={answer.rationale ?? ""}
                    placeholder="Explain how your evidence supports this score and classification."
                    onChange={(event) => updateAnswer({ rationale: event.target.value })} />
            </CardContent></Card>
            <div className="planning-step-actions">
                <Button variant="outline" disabled={phaseIndex === 0} onClick={() => onPhaseChange(evaluationPhases[phaseIndex - 1].id)}>Previous phase</Button>
                {phaseIndex < evaluationPhases.length - 1 && <Button disabled={score === null} onClick={() => onPhaseChange(evaluationPhases[phaseIndex + 1].id)}>Next phase</Button>}
            </div>
            <section className="planning-evaluation-results" aria-labelledby="evaluation-results-title">
                <h3 id="evaluation-results-title">Combine the three phase scores</h3>
                <p>The overall score combines your three phase judgments. Equal weights of 1 give their average. You may give a phase more weight to reflect your project's goals; weights are relative and do not need to total 100.</p>
                <div className="planning-evaluation-phases">
                    {results.phases.map((item) => (
                        <Card key={item.id}><CardContent>
                            <h4>{item.label}</h4>
                            <p>{item.score === null ? "Not scored" : `${item.score.toFixed(1)}% - ${evaluationBand(item.score)}`}</p>
                            <label htmlFor={`weight-${item.id}`}>{item.label} weight</label>
                            <Input id={`weight-${item.id}`} type="number" min={0} step="any" inputMode="decimal" value={weights[item.id]} onChange={(event) => onWeightChange(item.id, event.target.value)} />
                        </CardContent></Card>
                    ))}
                </div>
                <p role="status" className="planning-evaluation-total">
                    {!results.validWeights ? "Use non-negative weights, with at least one greater than zero."
                        : results.total === null ? "Assign a valid score to all three phases to calculate the overall score."
                            : `Overall score: ${results.total.toFixed(1)}% - ${evaluationBand(results.total)}`}
                </p>
            </section>
        </div>
    );
}

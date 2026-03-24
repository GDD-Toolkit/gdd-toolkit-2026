import { useState } from "react";
import "./HumanCenteredDesignQuiz.css";

type Props = {
  question?: string;
  options: string[];
  correctIndex?: number;
  wrongExplanation?: string;
  correctExplanation?: string;
};

export default function CollapsibleQuizQuestion({
  question = "",            // All components that make up a quiz question. Filled out in HumanCenteredDesignQuiz.tsx
  options = [],
  correctIndex = 0,
  wrongExplanation = "",
  correctExplanation = ""
}: Props) {
  const [open, setOpen] = useState<boolean>(true); // controls whether answers are visible or not
  const [selected, setSelected] = useState<number | null>(null);

  function handleToggle(): void {
    setOpen((s) => !s);
  }

  function handleSelect(index: number): void {
    setSelected(index);
  }

  return (
    <div className="entire-Quiz-Container">
      {/* Question header (click to collapse/expand answers) */}
      <button
        onClick={handleToggle}
        aria-expanded={open}
        className="quiz-Question-Box"
      >
        <div>
          <h3 className="large-SemiBold">
            {question}
          </h3>
          <p className="small-Grey-Text">
            Select the correct answer below
          </p>
        </div>
        <div className="hide-Show-Text">
            {open ? "Hide" : "Show"}
        </div>
      </button>

      {/* Answer Options */}
      {open && (
        <ul className="answers-List">
          {options.map((opt, i) => {  //"opt" is short for options (answers). i is the index of the answers
            // Determine styling when selected and whether it's correct/wrong
            const isSelected = selected === i;
            let optionClass ="answers-Box-Styling";
            if (isSelected) {
              optionClass += i == correctIndex
                ? " green-Correct"
                : " red-Incorrect";
            } else {
              optionClass += " default-Color";
            }

            return (
              <li key={i}>
                <button
                  onClick={() => handleSelect(i)}
                  className={optionClass}
                  aria-pressed={isSelected}
                >
                  <div className="answers-Spacing">
                    <div className="answers-Box-More-Styling">
                      {String.fromCharCode(65 + i)}.
                    </div>
                    <div className="answers-Content">
                        {opt}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {/* Feedback box shown after selecting an answer */}
      {selected != null && (
        <div
          role="status"
          aria-live="polite"
          className={`explanation-Box ${                                                 
            selected == correctIndex ? "green-Correct" : "red-Incorrect"
          }`}
        >
          {selected == correctIndex ? (
            <div>
              <p className="semiBold">Correct!</p>
              <p className="small-Text">{correctExplanation}</p>
            </div>
          ) : (
            <div>
              <p className="semiBold">Not quite — that answer is incorrect. Try again!</p>
              <p className="small-Text">{wrongExplanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
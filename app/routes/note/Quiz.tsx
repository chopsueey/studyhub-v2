import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

export interface QuizQuestions {
  quizTitle: string;
  questions: Question[];
}

export interface Question {
  question: string;
  options: string[];
  answerText: string;
  answer: string;
}

export default function Quiz(quiz: { quiz: QuizQuestions }) {
  const { quizTitle, questions } = quiz.quiz;
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const detailsRef = useRef<HTMLDetailsElement | null>(null);

  const [questionNumber, setQuestionNumber] = useState(0);

  function handleOutsideClick(e: MouseEvent) {
    const dialog = dialogRef.current;
    if (dialog) {
      const dialogDimensions = dialog.getBoundingClientRect();
      if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
      ) {
        dialog.close();
      }
    }
  }

  useEffect(() => {
    const dialog = dialogRef.current;

    if (dialog) {
      dialog.addEventListener("click", handleOutsideClick);
    }
    return () => {
      if (dialog)
        return dialog.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="w-fit p-2 mx-auto rounded-lg text-green-500 bg-white hover:bg-green-500 hover:text-white border hover:border-green-500 shadow-sm hover:shadow-md transition-all duration-300"
      >
        Start Quiz
      </button>
      <dialog
        ref={dialogRef}
        id="confirm-dialog"
        className="w-[768px] rounded-lg p-8 space-y-4 shadow-md -translate-y-1/2 top-1/2"
      >
        <div className="flex justify-center flex-col items-center space-y-16">
          <p className="text-3xl text-center px-4 italic">{quizTitle}</p>
          <div className="flex flex-col justify-center space-y-4">
            <h2 className="text-2xl p-4">
              {`${questionNumber + 1}. `}
              {questions[questionNumber].question}
            </h2>
            <div className="flex flex-col space-y-4 p-4">
              {questions[questionNumber].options.map((option) => {
                return (
                  <label
                    className="border-2 p-3 quiz-label rounded-lg cursor-pointer flex justify-between items-center"
                    key={Math.random()}
                  >
                    <input
                      type="radio"
                      name={questions[questionNumber].question}
                      value={questions[questionNumber].answerText}
                    />
                    {` ${option}`}
                    <span className="text-blue-500">
                      <Check />
                    </span>
                  </label>
                );
              })}
            </div>
            <details ref={detailsRef} className="cursor-pointer">
              <summary>Answer</summary>
              {/* TODO: Add a "Why" button, making a prompt to AI, asking to explain the answer in more detail (based on the actual note) */}
              <p>{questions[questionNumber].answerText}</p>
            </details>
          </div>
        </div>
        <div className="flex justify-evenly">
          <button
            type="button"
            className="w-fit p-2 select-none rounded-lg text-red-500 bg-white hover:bg-red-500 hover:text-white border hover:border-red-500 shadow-sm hover:shadow-md transition-all duration-300"
            onClick={() => {
              if (detailsRef.current) {
                detailsRef.current.open = false;
              }
              return questionNumber > 0
                ? setQuestionNumber(questionNumber - 1)
                : "";
            }}
          >
            &lt;back
          </button>
          <button
            type="button"
            className="w-fit p-2 select-none rounded-lg text-green-500 bg-white hover:bg-green-500 hover:text-white border hover:border-green-500 shadow-sm hover:shadow-md transition-all duration-300"
            onClick={() => {
              if (detailsRef.current) {
                detailsRef.current.open = false;
              }
              return questionNumber < questions.length - 1
                ? setQuestionNumber(questionNumber + 1)
                : "";
            }}
          >
            next&gt;
          </button>
        </div>
      </dialog>
    </>
  );
}

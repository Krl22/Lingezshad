import React, { useState } from "react";
import { Check, X, RotateCcw } from "lucide-react";

type SentenceItem = {
  id: string;
  sentence: string; // use ___ for blank
  answer: string;
  hint?: string;
};

type FillInTheBlankExerciseProps = {
  items: SentenceItem[];
  onComplete?: () => void;
};

export const FillInTheBlankExercise: React.FC<FillInTheBlankExerciseProps> = ({
  items,
  onComplete,
}) => {
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [showHints, setShowHints] = useState<{ [key: string]: boolean }>({});
  const [score, setScore] = useState(0);

  const handleChange = (id: string, value: string) => {
    setUserAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const toggleHint = (id: string) => {
    setShowHints((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const checkAnswers = () => {
    setShowResults(true);
    const correctAnswers = items.filter(
      (item) =>
        userAnswers[item.id]?.toLowerCase().trim() === item.answer.toLowerCase()
    ).length;
    setScore(correctAnswers);

    if (onComplete && correctAnswers === items.length) {
      onComplete();
    }
  };

  const resetExercise = () => {
    setUserAnswers({});
    setShowResults(false);
    setShowHints({});
    setScore(0);
  };

  return (
    <div className="flex flex-col gap-4 mx-auto w-full max-w-2xl">
      {/* Progress Bar - Más compacto */}
      {showResults && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              {score}/{items.length}
            </span>
            <span className="text-sm text-blue-600 dark:text-blue-300">
              {Math.round((score / items.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-blue-200 dark:bg-blue-900 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${(score / items.length) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Sentences - Diseño más minimalista */}
      {items.map((item, index) => {
        const parts = item.sentence.split("___");
        const isCorrect =
          showResults &&
          userAnswers[item.id]?.toLowerCase().trim() ===
            item.answer.toLowerCase();
        const isWrong = showResults && userAnswers[item.id] && !isCorrect;
        const isEmpty = !userAnswers[item.id]?.trim();

        return (
          <div
            key={item.id}
            className={`p-4 border rounded-lg transition-all duration-200 ${
              isCorrect
                ? "bg-green-50 border-green-400 dark:bg-green-950/20"
                : isWrong
                ? "bg-red-50 border-red-400 dark:bg-red-950/20"
                : "bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800"
            }`}
          >
            {/* Question Number - Más simple */}
            <div className="mb-3">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {index + 1}
              </span>
            </div>

            {/* Sentence with Input - Más compacto */}
            <div className="mb-3 text-base leading-relaxed">
              <span className="text-gray-800 dark:text-gray-200">
                {parts[0]}
              </span>
              <input
                type="text"
                value={userAnswers[item.id] || ""}
                onChange={(e) => handleChange(item.id, e.target.value)}
                placeholder="?"
                disabled={showResults}
                className={`mx-1 px-3 py-1 rounded border font-medium text-center min-w-[100px] transition-all duration-200 focus:ring-1 focus:ring-blue-400 dark:focus:ring-blue-500 ${
                  isCorrect
                    ? "text-green-800 bg-green-100 border-green-400 dark:bg-green-900/30 dark:text-green-200"
                    : isWrong
                    ? "text-red-800 bg-red-100 border-red-400 dark:bg-red-900/30 dark:text-red-200"
                    : "text-gray-800 bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 hover:border-blue-400 dark:hover:border-blue-500"
                }`}
              />
              <span className="text-gray-800 dark:text-gray-200">
                {parts[1]}
              </span>
            </div>

            {/* Hint - Más minimalista */}
            {item.hint && (
              <div className="mb-3">
                <button
                  onClick={() => toggleHint(item.id)}
                  className="text-xs text-blue-600 underline transition-colors dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  {showHints[item.id] ? "Hide hint" : "Show hint"}
                </button>
                {showHints[item.id] && (
                  <div className="p-2 mt-2 text-xs italic text-gray-600 bg-gray-50 rounded dark:bg-gray-700 dark:text-gray-300">
                    {item.hint}
                  </div>
                )}
              </div>
            )}

            {/* Result Feedback - Más compacto */}
            {showResults && (
              <div className="flex gap-2 items-center text-sm">
                {isCorrect ? (
                  <div className="flex gap-1 items-center text-green-600 dark:text-green-400">
                    <Check className="w-4 h-4" />
                    <span>Correct!</span>
                  </div>
                ) : isEmpty ? (
                  <div className="text-gray-500 dark:text-gray-400">
                    Answer: <strong>{item.answer}</strong>
                  </div>
                ) : (
                  <div className="flex gap-1 items-center text-red-600 dark:text-red-400">
                    <X className="w-4 h-4" />
                    <span>
                      Answer: <strong>{item.answer}</strong>
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Action Buttons - Más simples */}
      <div className="flex gap-3 justify-center mt-4">
        {!showResults ? (
          <button
            onClick={checkAnswers}
            className="px-6 py-2 font-medium text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
          >
            Check Answers
          </button>
        ) : (
          <button
            onClick={resetExercise}
            className="flex gap-2 items-center px-6 py-2 font-medium text-white bg-gray-600 rounded-lg transition-colors hover:bg-gray-700"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>

      {/* Motivational Message - Más sutil */}
      {showResults && score === items.length && (
        <div className="p-3 text-center bg-green-50 rounded-lg border border-green-200 dark:bg-green-950/20 dark:border-green-800">
          <p className="font-medium text-green-700 dark:text-green-300">
            🎉 Perfect score!
          </p>
        </div>
      )}
    </div>
  );
};

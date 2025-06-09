import React, { useState } from "react";
import { Check, X, Lightbulb, RotateCcw } from "lucide-react";

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
        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center justify-between mb-2">
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
          userAnswers[item.id]?.toLowerCase().trim() === item.answer.toLowerCase();
        const isWrong = showResults && userAnswers[item.id] && !isCorrect;
        const isEmpty = !userAnswers[item.id]?.trim();

        return (
          <div
            key={item.id}
            className={`p-4 border rounded-lg transition-all duration-200 ${
              isCorrect
                ? "border-green-400 bg-green-50 dark:bg-green-950/20"
                : isWrong
                ? "border-red-400 bg-red-50 dark:bg-red-950/20"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            }`}
          >
            {/* Question Number - Más simple */}
            <div className="mb-3">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {index + 1}
              </span>
            </div>

            {/* Sentence with Input - Más compacto */}
            <div className="text-base leading-relaxed mb-3">
              <span className="text-gray-800 dark:text-gray-200">{parts[0]}</span>
              <input
                type="text"
                value={userAnswers[item.id] || ""}
                onChange={(e) => handleChange(item.id, e.target.value)}
                placeholder="?"
                disabled={showResults}
                className={`mx-1 px-3 py-1 rounded border font-medium text-center min-w-[100px] transition-all duration-200 focus:ring-1 focus:ring-blue-400 dark:focus:ring-blue-500 ${
                  isCorrect
                    ? "bg-green-100 border-green-400 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                    : isWrong
                    ? "bg-red-100 border-red-400 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                    : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:border-blue-400 dark:hover:border-blue-500"
                }`}
              />
              <span className="text-gray-800 dark:text-gray-200">{parts[1]}</span>
            </div>

            {/* Hint - Más minimalista */}
            {item.hint && (
              <div className="mb-3">
                <button
                  onClick={() => toggleHint(item.id)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors underline"
                >
                  {showHints[item.id] ? 'Hide hint' : 'Show hint'}
                </button>
                {showHints[item.id] && (
                  <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300 italic">
                    {item.hint}
                  </div>
                )}
              </div>
            )}

            {/* Result Feedback - Más compacto */}
            {showResults && (
              <div className="flex items-center gap-2 text-sm">
                {isCorrect ? (
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <Check className="w-4 h-4" />
                    <span>Correct!</span>
                  </div>
                ) : isEmpty ? (
                  <div className="text-gray-500 dark:text-gray-400">
                    Answer: <strong>{item.answer}</strong>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                    <X className="w-4 h-4" />
                    <span>Answer: <strong>{item.answer}</strong></span>
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
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Check Answers
          </button>
        ) : (
          <button
            onClick={resetExercise}
            className="flex items-center gap-2 px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>

      {/* Motivational Message - Más sutil */}
      {showResults && score === items.length && (
        <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-700 dark:text-green-300 font-medium">🎉 Perfect score!</p>
        </div>
      )}
    </div>
  );
};

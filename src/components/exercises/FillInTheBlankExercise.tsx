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
    <div className="w-full max-w-4xl mx-auto p-3 space-y-3">
      {/* Progress Bar - Compacto y pegajoso */}
      {showResults && (
        <div className="sticky top-0 z-20 p-3 bg-gradient-to-r from-blue-50/95 via-indigo-50/90 to-purple-50/95 dark:from-blue-950/95 dark:via-indigo-950/90 dark:to-purple-950/95 rounded-lg border border-blue-200/50 dark:border-blue-800/30 backdrop-blur-md shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              {score}/{items.length}
            </span>
            <span className="text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              {Math.round((score / items.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gradient-to-r from-blue-200/50 to-indigo-200/50 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${(score / items.length) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Grid responsivo para ejercicios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
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
              className={`relative p-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md ${
                isCorrect
                  ? "bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-300/40 dark:border-green-700/30"
                  : isWrong
                  ? "bg-gradient-to-br from-red-50/80 to-rose-50/80 dark:from-red-950/30 dark:to-rose-950/30 border border-red-300/40 dark:border-red-700/30"
                  : "bg-gradient-to-br from-white/80 to-blue-50/40 dark:from-gray-800/80 dark:to-gray-700/60 border border-gray-200/40 dark:border-gray-600/30 hover:border-blue-300/50 dark:hover:border-blue-600/30"
              }`}
            >
              {/* Header compacto con número y hint */}
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold bg-gradient-to-r from-blue-500/20 to-indigo-500/20 dark:from-blue-400/20 dark:to-indigo-400/20 border border-blue-300/30 dark:border-blue-600/30 rounded-full">
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                      {index + 1}
                    </span>
                  </span>
                  {/* Hint button inline */}
                  {item.hint && (
                    <button
                      onClick={() => toggleHint(item.id)}
                      className="text-xs bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent font-medium hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-300 dark:hover:to-indigo-300 transition-all duration-200 underline decoration-blue-400/50"
                    >
                      {showHints[item.id] ? "💡" : "💭"}
                    </button>
                  )}
                </div>
                
                {/* Feedback compacto en el header */}
                {showResults && (
                  <div className="flex items-center">
                    {isCorrect ? (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-green-100/60 dark:bg-green-900/30">
                        <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                        <span className="text-xs font-medium text-green-700 dark:text-green-300">✓</span>
                      </div>
                    ) : isEmpty ? (
                      <div className="px-2 py-1 rounded-md bg-gray-100/60 dark:bg-gray-800/60">
                        <span className="text-xs text-gray-600 dark:text-gray-400">—</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-red-100/60 dark:bg-red-900/30">
                        <X className="w-3 h-3 text-red-600 dark:text-red-400" />
                        <span className="text-xs font-medium text-red-700 dark:text-red-300">✗</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Hint expandible */}
              {item.hint && showHints[item.id] && (
                <div className="mb-2 p-2 text-xs italic bg-gradient-to-r from-blue-50/60 to-indigo-50/60 dark:from-blue-900/20 dark:to-indigo-900/20 rounded border border-blue-200/30 dark:border-blue-700/20">
                  <span className="text-gray-700 dark:text-gray-300">{item.hint}</span>
                </div>
              )}

              {/* Sentence con input inline */}
              <div className="text-sm leading-relaxed">
                <span className="text-gray-800 dark:text-gray-200">{parts[0]}</span>
                <input
                  type="text"
                  value={userAnswers[item.id] || ""}
                  onChange={(e) => handleChange(item.id, e.target.value)}
                  placeholder="?"
                  disabled={showResults}
                  className={`mx-1 px-2 py-1 rounded border font-medium text-center min-w-[80px] max-w-[120px] text-xs transition-all duration-200 focus:ring-1 focus:ring-offset-1 ${
                    isCorrect
                      ? "text-green-800 bg-green-100/80 border-green-400 dark:bg-green-900/40 dark:text-green-200 dark:border-green-600"
                      : isWrong
                      ? "text-red-800 bg-red-100/80 border-red-400 dark:bg-red-900/40 dark:text-red-200 dark:border-red-600"
                      : "text-gray-800 bg-white/80 border-gray-300 dark:bg-gray-700/80 dark:border-gray-500 dark:text-gray-200 hover:border-blue-400 dark:hover:border-blue-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20"
                  }`}
                />
                <span className="text-gray-800 dark:text-gray-200">{parts[1]}</span>
              </div>

              {/* Respuesta correcta compacta */}
              {showResults && (isWrong || isEmpty) && (
                <div className="mt-2 text-xs">
                  <span className="text-gray-600 dark:text-gray-400">
                    Respuesta: <strong className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">{item.answer}</strong>
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons - Compactos y centrados */}
      <div className="flex gap-3 justify-center pt-2">
        {!showResults ? (
          <button
            onClick={checkAnswers}
            className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            Verificar
          </button>
        ) : (
          <button
            onClick={resetExercise}
            className="flex gap-2 items-center px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-gray-600 to-slate-600 rounded-lg transition-all duration-200 hover:from-gray-700 hover:to-slate-700 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            <RotateCcw className="w-4 h-4" />
            Reintentar
          </button>
        )}
      </div>

      {/* Mensaje de éxito compacto */}
      {showResults && score === items.length && (
        <div className="text-center p-3 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-950/40 dark:to-emerald-950/40 rounded-lg border border-green-300/40 dark:border-green-700/30">
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">🎉</span>
            <p className="text-sm font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              ¡Perfecto!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

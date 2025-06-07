import React, { useState } from "react";

type SentenceItem = {
  id: string;
  sentence: string; // use ___ for blank
  answer: string;
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

  const handleChange = (id: string, value: string) => {
    setUserAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const checkAnswers = () => {
    setShowResults(true);
    if (
      onComplete &&
      items.every(
        (item) =>
          userAnswers[item.id]?.toLowerCase().trim() ===
          item.answer.toLowerCase()
      )
    ) {
      onComplete();
    }
  };

  return (
    <div className="flex flex-col gap-6 mx-auto w-full max-w-2xl">
      {items.map((item) => {
        const parts = item.sentence.split("___");
        const isCorrect =
          showResults &&
          userAnswers[item.id]?.toLowerCase().trim() ===
            item.answer.toLowerCase();
        const isWrong = showResults && !isCorrect;
        return (
          <div key={item.id} className="text-lg">
            <span>{parts[0]}</span>
            <input
              type="text"
              value={userAnswers[item.id] || ""}
              onChange={(e) => handleChange(item.id, e.target.value)}
              className={`mx-2 px-3 py-1 rounded-md border ${
                isCorrect
                  ? "bg-green-50 border-green-500"
                  : isWrong
                  ? "bg-red-50 border-red-500"
                  : "border-gray-300"
              }`}
            />
            <span>{parts[1]}</span>
            {showResults && (
              <span className="ml-2 text-sm italic text-gray-600">
                {isCorrect ? "✅" : `❌ (${item.answer})`}
              </span>
            )}
          </div>
        );
      })}

      <button
        onClick={checkAnswers}
        className="self-start px-4 py-2 mt-4 text-white bg-blue-600 rounded-xl hover:bg-blue-700"
      >
        Check Answers
      </button>
    </div>
  );
};

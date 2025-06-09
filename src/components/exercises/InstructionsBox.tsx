import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface InstructionsBoxProps {
  title: string;
  instructions: string;
  icon?: React.ReactNode;
}

export const InstructionsBox: React.FC<InstructionsBoxProps> = ({
  title,
  instructions,
  icon = <HelpCircle className="w-4 h-4" />,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 border border-blue-300 dark:border-blue-700 rounded-lg transition-all duration-200 text-blue-800 dark:text-blue-200 font-medium shadow-sm hover:shadow-md"
      >
        {icon}
        <span>{title}</span>
        {isVisible ? (
          <ChevronUp className="w-4 h-4 ml-auto" />
        ) : (
          <ChevronDown className="w-4 h-4 ml-auto" />
        )}
      </button>
      
      {isVisible && (
        <div className="mt-2 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg animate-in slide-in-from-top-2 duration-200">
          <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
            {instructions}
          </p>
        </div>
      )}
    </div>
  );
};
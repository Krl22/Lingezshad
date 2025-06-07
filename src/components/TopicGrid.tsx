import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "./ui/card";

interface Exercise {
  type: string;
  title: string;
}

interface Topic {
  id: string;
  title: string;
  image: string;
  exercises: Exercise[];
  isNew?: boolean;
}

interface TopicGridProps {
  topics: Topic[];
}

export const TopicGrid = ({ topics }: TopicGridProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
      {topics.map((topic) => (
        <div className="relative">
          <Card
            key={topic.id}
            className="overflow-hidden rounded-2xl shadow-sm transition-shadow duration-300 cursor-pointer group hover:shadow-xl"
            onClick={() => navigate(`/topic/${topic.id}/exercises`)}
          >
            <div className="overflow-hidden relative aspect-square">
              <img
                src={topic.image}
                alt={topic.title}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <CardHeader className="p-2 text-center">
              <CardTitle className="text-sm font-semibold text-gray-800 transition-colors dark:text-gray-300 sm:text-base group-hover:text-primary">
                {topic.title}
              </CardTitle>
            </CardHeader>
          </Card>

          {topic.isNew && (
            <div className="overflow-visible absolute -top-2 -left-2 z-20">
              <div className="bg-red-500 text-white text-[12px] font-bold px-2 py-1 rotate-[-45deg] shadow-md rounded-sm">
                New!
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

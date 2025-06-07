import { TopicGrid } from "@/components/TopicGrid";
const Learning = () => {
  const topics = [
    {
      id: "5senses",
      title: "5 Senses",
      image: "/images/topics/5senses.jpg",
      exercises: [
        {
          type: "fillInTheBlank",
          title: "Complete las oraciones",
        },
        {
          type: "matching",
          title: "Emparejar palabras",
        },
        {
          type: "multipleChoice",
          title: "Selección múltiple",
        },
        {
          type: "dragAndDrop",
          title: "Arrastra y suelta",
        },
        {
          type: "wordOrder",
          title: "Ordena las palabras",
        },
      ],
      isNew: true,
    },
    {
      id: "actions",
      title: "Actions",
      image: "/images/topics/actions.png",
      exercises: [],
      isNew: true,
    },
    {
      id: "animals",
      title: "Animals",
      image: "/images/topics/animals.jpg",
      exercises: [],
      isNew: true,
    },
    {
      id: "body",
      title: "Body",
      image: "/images/topics/body.png",
      exercises: [],
      isNew: true,
    },
    {
      id: "clothes",
      title: "Clothes",
      image: "/images/topics/clothes.png",
      exercises: [],
      isNew: false,
    },
    {
      id: "colors",
      title: "Colors",
      image: "/images/topics/colors.jpg",
      exercises: [],
      isNew: false,
    },
    {
      id: "daily-routine",
      title: "Daily Routine",
      image: "/images/topics/Daily routine.jpg",
      exercises: [],
      isNew: false,
    },
    {
      id: "expressions",
      title: "Expressions",
      image: "/images/topics/expressions.jpg",
      exercises: [],
      isNew: false,
    },
    {
      id: "feelings",
      title: "Feelings",
      image: "/images/topics/feelings.jpg",
      exercises: [],
      isNew: false,
    },
    {
      id: "food",
      title: "Food",
      image: "/images/topics/food.png",
      exercises: [],
      isNew: false,
    },
    {
      id: "house-chores",
      title: "House Chores",
      image: "/images/topics/house chores.jpg",
      exercises: [],
      isNew: false,
    },
    {
      id: "numbers",
      title: "Numbers",
      image: "/images/topics/numbers.jpg",
      exercises: [],
      isNew: false,
    },
    {
      id: "posesive-adjective",
      title: "Posesive Adjective",
      image: "/images/topics/posesive adjective.jpg",
      exercises: [],
      isNew: false,
    },
    {
      id: "sports",
      title: "Sports",
      image: "/images/topics/sports.png",
      exercises: [],
      isNew: false,
    },
    {
      id: "weather",
      title: "Weather",
      image: "/images/topics/weather.jpg",
      exercises: [],
      isNew: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 pt-[92px] pb-[112px]">
        <div className="bg-[#142943] rounded-t-lg p-3 text-white">
          <h2 className="text-lg font-medium">Topics</h2>
        </div>
        <div className="p-4 bg-white rounded-b-lg shadow-md dark:bg-gray-800">
          <TopicGrid topics={topics} />
        </div>
      </div>
    </div>
  );
};

export default Learning;

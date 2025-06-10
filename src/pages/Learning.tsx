import { TopicGrid } from "@/components/TopicGrid";
const Learning = () => {
  const topics = [
    {
      id: "fivesenses",
      title: "5 Senses",
      image: "/topics/5senses.jpg",
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
      image: "/topics/actions.png",
      exercises: [],
      isNew: true,
    },
    {
      id: "animals",
      title: "Animals",
      image: "/topics/animals.jpg",
      exercises: [],
      isNew: true,
    },
    {
      id: "body",
      title: "Body",
      image: "/topics/body.png",
      exercises: [],
      isNew: true,
    },
    {
      id: "clothes",
      title: "Clothes",
      image: "/topics/clothes.png",
      exercises: [],
      isNew: false,
    },
    {
      id: "colors",
      title: "Colors",
      image: "/topics/colors.jpg",
      exercises: [],
      isNew: false,
    },
    {
      id: "daily-routine",
      title: "Daily Routine",
      image: "/topics/Daily routine.jpg",
      exercises: [],
      isNew: false,
    },
    {
      id: "expressions",
      title: "Expressions",
      image: "/topics/expressions.jpg",
      exercises: [],
      isNew: false,
    },
    {
      id: "feelings",
      title: "Feelings",
      image: "/topics/feelings.jpg",
      exercises: [],
      isNew: false,
    },
    {
      id: "food",
      title: "Food",
      image: "/topics/food.png",
      exercises: [],
      isNew: false,
    },
    {
      id: "house-chores",
      title: "House Chores",
      image: "/topics/house chores.jpg",
      exercises: [],
      isNew: false,
    },
    {
      id: "numbers",
      title: "Numbers",
      image: "/topics/numbers.jpg",
      exercises: [],
      isNew: false,
    },
    {
      id: "posesive-adjective",
      title: "Posesive Adjective",
      image: "/topics/posesive adjective.jpg",
      exercises: [],
      isNew: false,
    },
    {
      id: "sports",
      title: "Sports",
      image: "/topics/sports.png",
      exercises: [],
      isNew: false,
    },
    {
      id: "weather",
      title: "Weather",
      image: "/topics/weather.jpg",
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

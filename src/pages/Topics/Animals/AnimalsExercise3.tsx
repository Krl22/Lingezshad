import { AudioToImageMatchExercise } from "@/components/exercises/AudioToImageMatchExercise";

const AnimalExercise3 = () => {
  const items = [
    {
      id: "lion",
      image: "/animals/lion.jpg",
      audio: "/animals/lion.mp3",
    },
    {
      id: "elephant",
      image: "/animals/elephant.jpg",
      audio: "/animals/elephant.mp3",
    },
    {
      id: "monkey",
      image: "/animals/monkey.jpg",
      audio: "/animals/monkey.mp3",
    },
    {
      id: "duck",
      image: "/animals/duck.jpg",
      audio: "/animals/duck.mp3",
    },
    {
      id: "tiger",
      image: "/animals/tiger.jpg",
      audio: "/animals/tiger.mp3",
    },
    {
      id: "cat",
      image: "/animals/cat.jpg",
      audio: "/animals/cat.mp3",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="mb-6 text-2xl font-bold text-center">
        Match the Sound to the Animal
      </h1>
      <AudioToImageMatchExercise items={items} />
    </div>
  );
};

export default AnimalExercise3;

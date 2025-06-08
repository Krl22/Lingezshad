import {
  DragAndDropExercise,
  ExerciseItem,
} from "@/components/exercises/DragDropExercise";

const animalItems: ExerciseItem[] = [
  {
    id: "cat",
    label: "Cat",
    image: "/animals/cat.jpg",
  },
  {
    id: "elephant",
    label: "Elephant",
    image: "/animals/elephant.jpg",
  },
  {
    id: "lion",
    label: "Lion",
    image: "/animals/lion.jpg",
  },
  {
    id: "zebra",
    label: "Zebra",
    image: "/animals/zebra.jpg",
  },
  {
    id: "tiger",
    label: "Tiger",
    image: "/animals/tiger.jpg",
  },
  {
    id: "monkey",
    label: "Monkey",
    image: "/animals/monkey.jpg",
  },
];

export default function AnimalsTopic() {
  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">
        Match the animals with their names
      </h2>
      <DragAndDropExercise items={animalItems} />
    </div>
  );
}

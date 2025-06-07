import {
  DragAndDropExercise,
  ExerciseItem,
} from "@/components/exercises/DragDropExercise";

const animalItems: ExerciseItem[] = [
  {
    id: "cat",
    label: "Cat",
    image: "https://www.alleycat.org/wp-content/uploads/2019/03/FELV-cat.jpg",
  },
  {
    id: "dog",
    label: "Dog",
    image:
      "https://media.post.rvohealth.io/wp-content/uploads/sites/3/2020/02/322868_1100-732x549.jpg",
  },
  {
    id: "elephant",
    label: "Elephant",
    image:
      "https://files.worldwildlife.org/wwfcmsprod/images/African_Elephant_Kenya_112367/hero_small/3v49raxlb8_WW187785.jpg",
  },
  {
    id: "lion",
    label: "Lion",
    image:
      "https://wildaid.org/wp-content/uploads/2022/08/Untitled-design-32-400x335.png",
  },
  {
    id: "zebra",
    label: "zebra",
    image:
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj6hUpGHGSY9JkZUCnIq-HTIJ0mX33ochjQ-O3Isbn20vMaw8tuIfNJm4Iz88FYYE_ZuHDWM0hZFuaFVm1UOYYue6emm9B6tr5RnezScIAffk-WpWHt0KXpe8MfM92zOfhKPa7QyIFXng/s1600/Grevy%2527s_Zebra_Stallion.jpg",
  },
  {
    id: "penguin",
    label: "penguin",
    image:
      "https://www.cabq.gov/artsculture/biopark/news/10-cool-facts-about-penguins/@@images/1a36b305-412d-405e-a38b-0947ce6709ba.jpeg",
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

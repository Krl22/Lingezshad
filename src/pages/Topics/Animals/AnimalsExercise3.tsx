import { AudioToImageMatchExercise } from "@/components/exercises/AudioToImageMatchExercise";

const AnimalExercise3 = () => {
  const items = [
    {
      id: "lion",
      image:
        "https://wildaid.org/wp-content/uploads/2022/08/Untitled-design-32-400x335.png",
      audio: "/audio/lion.mp3",
    },
    {
      id: "elephant",
      image:
        "https://d1jyxxz9imt9yb.cloudfront.net/medialib/5204/image/s768x1300/MIGNON-vanessa-107A7245_reduced.jpg",
      audio: "/audio/elephant.mp3",
    },
    {
      id: "monkey",
      image:
        "https://c.ndtvimg.com/2023-07/qrtpmldg_baby-monkey-generic_625x300_28_July_23.jpg?im=FitAndFill,algorithm=dnn,width=1200,height=738",
      audio: "/audio/monkey.mp3",
    },
    {
      id: "duck",
      image:
        "https://s3.us-east-1.amazonaws.com/assets.mapleleaffarms.com/content/Pages/4-Farm-raised-Duck/Duck-Breeds/_716x416_crop_center_85_none/white-pekin-duck-breed.jpg",
      audio: "/audio/duck.mp3",
    },
    {
      id: "tiger",
      image:
        "https://www.akronzoo.org/sites/default/files/styles/uncropped_xl/public/2022-05/Tiger-main.png?itok=HfmVWdFd",
      audio: "/audio/tiger.mp3",
    },
    {
      id: "cat",
      image:
        "https://www.aspca.org/sites/default/files/cat-care_general-cat-care_body1-left.jpg",
      audio: "/audio/cat.mp3",
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

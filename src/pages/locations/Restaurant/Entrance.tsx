import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Volume2 } from "lucide-react";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/firebase/firebaseconfig";

interface Props {
  changeScene: (sceneName: string) => void;
}

interface MediaUrls {
  [key: string]: string;
}

interface DisabledButtons {
  reservation: boolean;
}

const RestaurantScene: React.FC<Props> = ({ changeScene }) => {
  const [isAudioEnded, setIsAudioEnded] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [restartKey, setRestartKey] = useState(0);
  const [disabledButtons, setDisabledButtons] = useState<DisabledButtons>({
    reservation: false,
  });
  const [isAnimatingHost, setIsAnimatingHost] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [mediaUrls, setMediaUrls] = useState<MediaUrls>({});

  const replayScene = () => {
    setRestartKey((prevKey) => prevKey + 1);
    setIsAudioEnded(false);
    setDisabledButtons({ reservation: false });
  };

  const replayAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const loadMedia = async () => {
    const paths = {
      restaurantBg: "Restaurant/Entrance/entrance.jpg",
      hostImage: "Restaurant/Entrance/waitress.png",
      hostWelcomeAudio: "Restaurant/Entrance/waitressWelcome.mp3",
      answer1: "Restaurant/Entrance/Table for two, please.mp3",
      answer2: "Restaurant/Entrance/Table for four, please.mp3",
      answer3: "Restaurant/Entrance/Do I need a reservation.mp3",
      answer4: "Restaurant/Entrance/Can I see the menu.mp3",
      hostA1: "Restaurant/Entrance/hostA1.mp3",
      hostA2: "Restaurant/Entrance/hostA2.mp3",
      hostA21: "Restaurant/Entrance/hostA21.mp3",
      hostA3: "Restaurant/Entrance/hostA3.mp3",
      hostA4: "Restaurant/Entrance/hostA4.mp3",
      waitressvid1: "Restaurant/Entrance/waitress talking_1.mov",
    };

    const entries = Object.entries(paths);
    const urlsArray = await Promise.all(
      entries.map(async ([key, path]) => {
        const storageRef = ref(storage, path);
        const url = await getDownloadURL(storageRef);
        return [key, url];
      })
    );

    const urls = Object.fromEntries(urlsArray);
    setMediaUrls(urls);
  };

  useEffect(() => {
    loadMedia();
  }, []);

  if (!Object.keys(mediaUrls).length) {
    return <p>Loading...</p>;
  }

  const handleOptionClick = (option: string) => {
    const audioMap: { [key: string]: string } = {
      tableTwo: mediaUrls.answer1,
      tableFour: mediaUrls.answer2,
      reservation: mediaUrls.answer3,
      menu: mediaUrls.answer4,
    };

    const hostAudioMap: { [key: string]: string } = {
      tableTwo: mediaUrls.hostA1,
      tableFour: mediaUrls.hostA2,
      reservation: mediaUrls.hostA3,
      menu: mediaUrls.hostA4,
    };

    const playAudio = (audioPath: string, callback: (() => void) | null) => {
      const audio = new Audio(audioPath);
      audio.play();
      if (callback) {
        audio.onended = callback;
      }
    };

    switch (option) {
      case "tableTwo":
        playAudio(audioMap[option], () =>
          playAudio(hostAudioMap[option], () =>
            handleSceneChange(`${option}Scene`)
          )
        );
        break;

      case "tableFour":
        playAudio(audioMap[option], () => {
          playAudio(hostAudioMap[option], () => {
            setIsAnimatingHost(true);
            setTimeout(() => {
              setIsAnimatingHost(false);
              playAudio(mediaUrls.hostA21, () =>
                handleSceneChange(`${option}Scene`)
              );
            }, 2000);
          });
        });
        break;

      case "reservation":
        setDisabledButtons((prev) => ({ ...prev, reservation: true }));
        playAudio(audioMap[option], () =>
          playAudio(hostAudioMap[option], null)
        );
        break;

      case "menu":
        playAudio(audioMap[option], () =>
          playAudio(hostAudioMap[option], null)
        );
        break;

      default:
        break;
    }
  };

  const handleSceneChange = (nextScene: string) => {
    setIsExiting(true);
    setTimeout(() => changeScene(nextScene), 1000);
  };

  return (
    <motion.div
      key={restartKey}
      className="flex flex-col items-center justify-around w-full h-screen p-4 pt-10 pb-24 lg:flex-row"
      initial={{ opacity: 1 }}
      animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="relative flex items-center justify-center w-full max-w-4xl mt-8 aspect-video">
        <img
          src={mediaUrls.restaurantBg}
          alt="Restaurant Background"
          className="absolute object-cover w-full h-full rounded-lg shadow-lg"
        />
        <motion.img
          src={mediaUrls.hostImage}
          alt="Host"
          className="absolute bottom-0 w-1/3"
          initial={{ x: "-100%", opacity: 0 }}
          animate={isAnimatingHost ? { x: "200%" } : { x: "20%", opacity: 1 }}
          transition={{
            x: { duration: 1.5, ease: "easeOut" },
            opacity: { duration: 1 },
          }}
        />
      </div>

      <audio
        ref={audioRef}
        src={mediaUrls.hostWelcomeAudio}
        autoPlay
        onEnded={() => setIsAudioEnded(true)}
      />

      <motion.div
        className="w-full max-w-md px-6 py-8 rounded-lg shadow-lg bg-white/90 backdrop-blur-lg sm:px-10 md:px-14"
        initial={{ opacity: 0 }}
        animate={{ opacity: isAudioEnded ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        <div className="text-center">
          <div className="mb-6">
            <p className="w-4/5 text-lg font-semibold text-gray-900 text-start">
              Hello! How can I help you?
            </p>
            <div className="flex items-center justify-center my-6 space-x-4">
              <button
                onClick={replayScene}
                className="flex items-center justify-center w-10 h-10 text-white bg-blue-500 rounded-full shadow-lg hover:bg-blue-600 hover:scale-105"
                aria-label="Replay Scene"
              >
                <RotateCcw size={24} />
              </button>
              <button
                onClick={replayAudio}
                className="flex items-center justify-center w-10 h-10 text-white bg-green-500 rounded-full shadow-lg hover:bg-green-600 hover:scale-105"
                aria-label="Replay Audio"
              >
                <Volume2 size={24} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
            <button
              onClick={() => handleOptionClick("tableTwo")}
              className="px-6 py-3 text-sm font-medium text-white transition duration-200 bg-blue-600 rounded-lg shadow sm:text-base hover:bg-blue-700 hover:scale-105"
            >
              Table for two
            </button>
            <button
              onClick={() => handleOptionClick("tableFour")}
              className="px-6 py-3 text-sm font-medium text-white transition duration-200 bg-blue-600 rounded-lg shadow sm:text-base hover:bg-blue-700 hover:scale-105"
            >
              Table for four
            </button>
            <button
              onClick={() => handleOptionClick("reservation")}
              className={`px-6 py-3 text-sm font-medium transition duration-200 rounded-lg shadow sm:text-base ${
                disabledButtons.reservation
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105"
              }`}
              disabled={disabledButtons.reservation}
            >
              Do I need a reservation?
            </button>
            <button
              onClick={() => handleOptionClick("menu")}
              className="px-6 py-3 text-sm font-medium text-white transition duration-200 bg-blue-600 rounded-lg shadow sm:text-base hover:bg-blue-700 hover:scale-105"
            >
              Can I see the menu?
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RestaurantScene;

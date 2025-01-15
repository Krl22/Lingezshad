import { useState } from "react";
import EntranceScene from "./Entrance";
// import TableScene from "./Table";

const Scene = () => {
  const [currentScene, setCurrentScene] = useState("entrance");

  // Función para cambiar de escena
  const changeScene = (sceneName: string) => {
    setCurrentScene(sceneName);
  };

  // Renderiza la escena actual
  const renderScene = () => {
    switch (currentScene) {
      case "entrance":
        return <EntranceScene changeScene={changeScene} />;
      // case "tableTwoScene":
      //   return <TableScene changeScene={changeScene} />;
      default:
        return <div>Unknown scene</div>;
    }
  };

  return <div className="h-screen">{renderScene()}</div>;
};

export default Scene;

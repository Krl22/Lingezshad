import { Link } from "react-router-dom";

const Restaurant = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 pb-16 bg-gradient-to-r from-green-100 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-md p-8 text-center bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <h1 className="mb-4 text-3xl font-bold text-gray-800 dark:text-white">
          Restaurant Roleplay
        </h1>

        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Instructions: Follow the scene and select an answer when asked.
        </p>
        <div className="flex justify-center w-full">
          <Link to="/restaurant/scene">
            <button className="btn-1 ">
              <span>Start</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Restaurant;

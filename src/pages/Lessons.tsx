import LessonList from "./LessonsList";

const Lessons = () => {
  return (
    <div className="min-h-screen p-6 bg-blue-100 rounded-lg dark:bg-gray-800">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-blue-700 dark:text-blue-300">
          Lessons
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Improve your English skills with our comprehensive lessons
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {LessonList.map((lesson, index) => (
          <div
            className="overflow-hidden transition duration-300 transform bg-white rounded-lg shadow-lg dark:bg-gray-900 hover:scale-105 hover:shadow-2xl"
            key={index}
          >
            <div className="relative">
              <img
                src={lesson.image}
                alt={lesson.title}
                className="object-cover w-full h-48"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300">
                {lesson.title}
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {lesson.description}
              </p>
              <a
                href="#"
                className="inline-block mt-4 text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500"
              >
                Learn More
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lessons;

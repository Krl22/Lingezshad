import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider } from "@/firebase/firebaseconfig";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { createUserDoc } from "@/firebase/createUserDoc";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);

      navigate("/home");
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const defaultNickname = user.email.split("@")[0];

      await createUserDoc(user, defaultNickname);
      // Redirigir a /home después de iniciar sesión
      navigate("/home");
    } catch (error) {
      console.error("Error logging in with Google:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="p-8 space-y-6 w-full max-w-md bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Welcome
        </h2>
        <p className="text-center text-gray-600">
          We are happy to have you back!
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Email or phone
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 w-full text-sm text-gray-700 rounded border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-2 w-full text-sm text-gray-700 rounded border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <label className="flex items-center text-sm text-gray-700">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-blue-500">
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            className="px-4 py-2 w-full text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Sign In
          </button>
        </form>
        <div className="flex justify-center items-center my-4">
          <span className="w-1/3 border-t border-gray-300"></span>
          <span className="mx-2 text-sm text-gray-500">Or</span>
          <span className="w-1/3 border-t border-gray-300"></span>
        </div>
        <button
          onClick={handleGoogleLogin}
          className="flex justify-center items-center px-4 py-2 w-full text-gray-700 rounded border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300"
        >
          <img
            src="https://img.icons8.com/color/16/000000/google-logo.png"
            alt="Google logo"
            className="mr-2"
          />
          Sign In with Google
        </button>
        <p className="text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

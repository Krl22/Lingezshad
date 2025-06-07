import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider } from "@/firebase/firebaseconfig";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  UserCredential,
  User,
} from "firebase/auth";
import { createUserDoc } from "@/firebase/createUserDoc";

const Register = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(auth, email, password);
      const user: User = userCredential.user;

      // Verificación de que el email no sea null
      if (user.email) {
        // Crea el documento en Firestore sin necesidad de pasar defaultNickname
        await createUserDoc({
          uid: user.uid,
          email: user.email,
        });
      } else {
        console.error("Error: User email is null");
      }

      navigate("/home");
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user: User = result.user;

      // Verificación de que el email no sea null
      if (user.email) {
        // Crea el documento en Firestore sin necesidad de pasar defaultNickname
        await createUserDoc({
          uid: user.uid,
          email: user.email,
        });
      } else {
        console.error("Error: User email is null");
      }

      navigate("/home");
    } catch (error) {
      console.error("Error registering with Google:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="p-6 space-y-6 w-full max-w-md text-gray-800 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Register
        </h2>
        <p className="text-center text-gray-600">Create your account</p>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3 py-2 w-full rounded-lg border border-gray-300 shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-3 py-2 w-full rounded-lg border border-gray-300 shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 w-full text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Register
          </button>
        </form>
        <div className="flex justify-center items-center my-4">
          <span className="text-sm text-gray-500">Or</span>
        </div>
        <button
          onClick={handleGoogleRegister}
          className="flex justify-center items-center px-4 py-2 w-full text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-100"
        >
          <img
            src="https://img.icons8.com/color/16/000000/google-logo.png"
            alt="Google logo"
            className="mr-2"
          />
          Register with Google
        </button>
        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

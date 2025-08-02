import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/config";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { IoHome } from "react-icons/io5";
import { doc, getDoc } from "firebase/firestore";

const SupplierLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Check Firestore "suppliers" collection
      const docRef = doc(db, "suppliers", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        alert("Access denied: No supplier exists.");
        return;
      }

      // const userData = docSnap.data();
      // if (userData.role !== "supplier") {
      //   alert("Access denied: Not a supplier.");
      //   return;
      // }

      // Login success – go to supplier dashboard
      navigate("/supplier/dashboard");
    } catch (err) {
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4 py-8">
      
      <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-md">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-gray-800">
          Supplier Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-1 focus:ring-green-600"
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg pr-10 focus:outline-none focus:ring-1 focus:ring-green-600"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div
            className="absolute top-3 right-3 text-gray-500 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </div>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-all duration-300 cursor-pointer"
        >
          Login
        </button>

        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <span
            className="text-green-600 hover:underline cursor-pointer"
            onClick={() => navigate("/supplier/register")}
          >
            Register
          </span>
        </p>
      </div>
      <button
        className="mt-4 flex items-center gap-2 text-green-600 hover:text-green-800 transition-all duration-300 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <IoHome size={18} />
        Back to Home
      </button>
    </div>
  );
};

export default SupplierLogin;

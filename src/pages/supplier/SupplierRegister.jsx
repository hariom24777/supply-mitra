import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/config";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { IoHome } from "react-icons/io5";
import { doc, setDoc } from "firebase/firestore";

const SupplierRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirm) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // Save supplier role to Firestore
      await setDoc(doc(db, "suppliers", user.uid), {
        uid: user.uid,
        email: user.email,
        role: "supplier",
        createdAt: new Date(),
      });

      alert("Registration successful!");
      navigate("/supplier/profile-setup");
    } catch (err) {
      alert("Registration failed. " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4 py-8">
      <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-md">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-gray-800">
          Supplier Registration
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-1 focus:ring-green-600"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-1 focus:ring-green-600"
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="relative mb-4">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="w-full p-3 border border-gray-300 rounded-lg pr-10 focus:outline-none focus:ring-1 focus:ring-green-600"
            onChange={(e) => setConfirm(e.target.value)}
          />
          <div
            className="absolute top-3 right-3 text-gray-500 cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </div>
        </div>

        <button
          onClick={handleRegister}
          className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-all duration-300 cursor-pointer"
        >
          Register
        </button>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <span
            className="text-green-600 hover:underline cursor-pointer"
            onClick={() => navigate("/supplier/login")}
          >
            Login
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

export default SupplierRegister;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/config";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { IoHome } from "react-icons/io5";
import { doc, getDoc } from "firebase/firestore";

const VendorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    //  Check if user exists in 'vendors' collection
    const userDoc = await getDoc(doc(db, "vendors", uid));

    if (!userDoc.exists()) {
      alert("Access denied: Not a vendor account.");
      return;
    }

    //  Proceed to vendor dashboard
    navigate("/vendor/dashboard");
  } catch (err) {
    alert("Login failed. " + err.message);
  }
};


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-8">
      <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 w-full max-w-md">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <div
            className="absolute top-3 right-3 text-gray-500 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
            aria-label="Toggle Password Visibility"
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </div>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don&apos;t have an account?{" "}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate("/vendor/register")}
          >
            Register
          </span>
        </p>
      </div>

      <button
        className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
        onClick={() => navigate("/")}
      >
        <IoHome size={18} />
        Back to Home
      </button>
    </div>
  );
};

export default VendorLogin;

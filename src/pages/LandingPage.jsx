import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4 ">
      {/* Logo & Title - Outside the card */}
      <div className="flex flex-col items-center mb-8">
        <div className="rounded-full bg-white flex items-center justify-center overflow-hidden mb-2">
          <img src="/logo.png" alt="Supply Mitra Logo" className="h-16 w-16 pt-1"/>
        </div>
        <h1 className="text-3xl font-semibold text-gray-800">Supply Mitra</h1>
      </div>

      {/* Main Card */}
      <div className="py-2 md:py-12 bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-5xl">
        {/* Left - SVG Illustration */}
        <div className="w-full md:w-1/2 p-6 flex items-center justify-center bg-blue-50">
          <img
            src="/landing-page-illustration.svg"
            alt="Role Selection"
            className="w-full h-auto max-h-72 md:max-h-full"
          />
        </div>

        {/* Right - Role Selection */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center md:text-left">
            Select your role to continue
          </h2>
          <p className="mb-6 text-gray-600 text-center md:text-left">
            Are you a supplier or a vendor? Choose below:
          </p>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => navigate("/supplier/login")}
              className="bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-lg"
            >
              Continue as Supplier
            </button>
            <button
              onClick={() => navigate("/vendor/login")}
              className="bg-blue-600 text-white hover:bg-blue-700 font-medium py-2 px-4 rounded-lg"
            >
              Continue as Vendor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, ClipboardList } from "lucide-react";
import { useAuth } from "../apis/authProvider";

const Landing = () => {
  const { authUser, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) {
      navigate("/admin/unresolvedReports");
    }
  }, [authUser, navigate]);

  const handleStaffLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error("Login error");
    }
  };

  const handleReport = () => {
    navigate("/create/report");
  };

  return (
    <main className="h-screen bg-white flex flex-col items-center justify-center container mx-auto md:p-12">
      <img src="padslogo-dark.png" className="h-25 mb-3"/>
      <h1 className="text-3xl font-extrabold font-['Manrope'] text-indigo-900 text-center">
        Welcome to Good Neighbor
      </h1>
      <p className="hidden md:display mt-2 text-sm font-medium font-['Manrope'] italic text-slate-600 ">
        A community-based reporting system that helps connect individuals with
        PADS Lake County
      </p>

      <div className="mt-12 max-w-3xl flex flex-col gap-8">
        <div className="md:col-span-2 bg-white rounded-xl shadow-xs border border-slate-100 p-8 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4 text-indigo-900 font-['Manrope']">
            Report an Individual
          </h2>
          <p className="text-slate-600 mb-8 font-medium text-center max-w-md font-['Manrope']">
            Help connect someone experiencing homelessness or in need with
            social services. Your report makes a difference in our community.
          </p>
          <button
            onClick={handleReport}
            className="bg-indigo-950 hover:bg-indigo-900 text-white font-bold py-3 px-8 rounded-full flex items-center"
          >
            <ClipboardList size={20} className="mr-2" />
            Report
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-xs p-6 flex flex-col border border-slate-100 items-center">
          <h2 className="text-lg font-semibold mb-2 text-indigo-900 font-['Manrope']">
            Staff Portal
          </h2>
          <p className="text-slate-600 mb-4 text-center font-['Manrope']">
            Secure access for authorized PADS Lake County staff.
          </p>
          <button
            onClick={handleStaffLogin}
            className="bg-indigo-200 hover:bg-indigo-300 text-indigo-900 font-bold py-3 px-8 rounded-full flex items-center text-sm"
          >
            <LogIn size={14} className="mr-1" />
            Login
          </button>
        </div>
      </div>
    </main>
  );
};

export default Landing;

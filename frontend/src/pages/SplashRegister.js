import React from "react";
import RegisterForm from "../components/RegisterForm";
import REGISTERIMG from "../../public/assets/images/register.jpg";

const SplashRegister = () => {
  return (
    <div className="min-h-screen bg-dark text-light flex">
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: `url(${REGISTERIMG})`,
        }}
      ></div>

      <div className="flex w-full md:w-1/2 justify-center items-center p-6">
        <div className="w-full max-w-md">
          <RegisterForm />
          <p className="mt-6 text-center text-gray-300">
            Already have an account?{" "}
            <a href="/login" className="text-yellow-400 hover:text-yellow-500">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashRegister;

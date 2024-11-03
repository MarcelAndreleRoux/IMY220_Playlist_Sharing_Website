import React from "react";
import LoginForm from "../components/LoginForm";
import LOGINIMG from "../../public/assets/images/login.jpg";

const SplashLogin = () => {
  return (
    <div className="min-h-screen bg-dark text-light flex">
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: `url(${LOGINIMG})`,
        }}
      ></div>

      <div className="flex w-full md:w-1/2 justify-center items-center p-6">
        <div className="w-full max-w-md">
          <LoginForm />
          <p className="mt-6 text-center text-gray-300">
            Haven't created an account yet?{" "}
            <a
              href="/register"
              className="text-yellow-400 hover:text-yellow-500"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashLogin;

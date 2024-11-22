"use client";
import { useState } from "react";
import CustomLoginInput from "@/components/CustomLoginInput";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/login`,
        {
          email,
          password,
        }
      );
      const { token } = response.data;
      toast.success("Connexion réussie");
      localStorage.setItem("token", token);
      window.location.href = "/documents";
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-row  ">
      <div className="hidden sm:flex w-full bg-secondary items-center justify-center ">
        <Image
          src="/logos/main.png"
          width={280}
          height={280}
          alt="logo"
          className=" w-full px-4 md:px-8 lg:px-24 gap-8 "
        />
      </div>
      <div className="flex w-full bg-white flex-col items-center justify-center px-4 md:px-8 lg:px-24 gap-8 text-center text-black">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Bienvenue dans votre espace
          </h1>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </p>
        </div>
        <div className="w-full max-w-[480px] flex flex-col gap-4">
          <CustomLoginInput
            icon="mail"
            placeholder="Entrer votre addresse email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <CustomLoginInput
            icon="password"
            placeholder="Entrer votre mot de passe"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            className="flex items-center justify-center w-full px-8 py-4 bg-primary rounded-xl cursor-pointer select-none hover:bg-opacity-95"
          >
            <span className="text-white font-semibold text-xl">Connecter</span>
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>
    </main>
  );
}

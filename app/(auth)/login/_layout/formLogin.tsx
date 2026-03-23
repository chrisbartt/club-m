"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Lock, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const FormLogin = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleGoBack = () => {
    router.back();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (!res || res.error) {
        setErrorMessage("Email ou mot de passe incorrect.");
        setIsSubmitting(false);
        return;
      }

      // Récupérer le rôle pour rediriger
      let redirectTo = "/membre";
      try {
        const meRes = await fetch("/api/membre/me");
        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData?.user?.role === "ADMIN") redirectTo = "/admin";
        }
      } catch {
        // Fallback vers /membre
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      setErrorMessage("Email ou mot de passe incorrect.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="blockLogin min-h-screen relative z-10 flex flex-col justify-center items-center lg:py-10 py-10">
      <button
        onClick={handleGoBack}
        className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-[#091626] text-white hover:bg-[#091626] shadow-none hover:text-white transition-colors duration-200 cursor-pointer absolute top-4 left-4"
      >
        <ArrowLeft size={20}></ArrowLeft>
      </button>
      <div className="block-img fixed top-0 left-0 w-full h-full -z-20">
        {/* <Image
          src="/images/banner4.jpg"
          alt="Banner"
          fill
          className="object-cover w-full h-full"
        /> */}
        <video
          src="/videos/2.mp4"
          autoPlay
          muted
          loop
          className="object-cover w-full h-full"
        />
      </div>
      <div className="block-bg absolute inset-0 bg-black/30 -z-10"></div>
      <div>
        <div className="container mx-auto lg:mb-10">
          <div className="text-center text-white">
            <Link href="/" className="flex items-center">
              <Image
                src="/logos/logo1.png"
                alt="Club M"
                width={0}
                height={0}
                layout="responsive"
                className="w-[60px!important]"
              />
            </Link>
          </div>
        </div>
      </div>
      <div className="block-form my-auto w-full">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-12">
            <div className="col-span-4"></div>
            <div className="col-span-12 lg:col-span-4 lg:px-6">
              <div className="card-login bg-white rounded-xl lg:p-10 p-6">
                <div className="card-login-header">
                  <h2 className="md:text-3xl text-2xl font-medium mb-2 text-[#091626]">Bon retour au Club M.
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6 md:text-base">
                  Connecte-toi pour accéder à ton espace membre et à la communauté.

                  </p>

                  {/* Messages d'erreur */}
                  {errorMessage && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                      {errorMessage}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-12 gap-3 lg:gap-4">
                      <div className="col-span-12">
                        <div className="relative flex items-center">
                          <div className="absolute px-3 text-[#091626]">
                            <Mail size={22} />
                          </div>
                          <Input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="shadow-none pl-10 h-[46px] focus-visible:ring-0 focus-visible:border-[#091626] rounded-lg"
                            required
                            placeholder="Votre adresse email"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                      <div className="col-span-12">
                        <div className="relative flex items-center">
                          <div className="absolute px-3 text-[#091626]">
                            <Lock size={22} />
                          </div>
                          <Input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="shadow-none pl-10 h-[46px] focus-visible:ring-0 focus-visible:border-[#091626] rounded-lg"
                            required
                            placeholder="Votre mot de passe"
                            disabled={isSubmitting}
                          />
                        </div>
                        <div className="text-end mt-2">
                          <Link
                            href={"#"}
                            className="text-sm text-[#091626] hover:text-primary"
                          >
                            Mot de passe oublié ?
                          </Link>
                        </div>
                      </div>
                      <div className="col-span-12">
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full h-[46px] shadow-none bg-[#a55b46] text-white hover:bg-[#a55b46]/80 cursor-pointer rounded-lg mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting
                            ? "Connexion en cours..."
                            : "Se connecter"}
                        </Button>
                      </div>
                    </div>
                  </form>
                  <div className="mt-6">
                    <p className="text-[#091626] text-sm md:text-base">
                    Pas encore membre ? {" "}
                      <Link
                        href="/devenir-membre"
                        className="text-[#a55b46] font-medium underline"
                      >
                       Rejoins le Club M
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-4"></div>
          </div>
        </div>
      </div>
      <div>
        <div className="container mx-auto lg:mt-10">
          <div className="text-center text-white text-sm">
            <p className="opacity-80">
              Copyright © 2025 Club M. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormLogin;

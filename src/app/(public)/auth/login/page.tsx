"use client";
import { Icon } from "@iconify/react";
import { Button } from "@/app/components/ui/button";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/hooks/auth/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  type LoginFormData,
} from "@/app/lib/validators/auth.validator";
import Link from "next/link";

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const safeRedirect = redirect && redirect.startsWith("/") ? redirect : null;

  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoggingIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "web.dev@freelance.fr",
      password: "Dev12345!",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      // La redirection est gérée dans le hook useAuth
    } catch (error: any) {
      // Gérer les erreurs spécifiques
      if (error.message?.toLowerCase().includes("email")) {
        setError("email", { type: "manual", message: error.message });
      } else if (error.message?.toLowerCase().includes("password")) {
        setError("password", { type: "manual", message: error.message });
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-card rounded-3xl p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Connectez-vous à votre compte
          </h1>

          <p className="text-lg text-gray-600 font-medium">
            Heureux de vous revoir parmi nous
          </p>

          {/* Email */}
          <div className="space-y-2">
            <div
              className={`relative border-2 rounded-2xl p-4 transition-colors bg-card ${
                errors.email ? "border-red-500" : "border-login"
              }`}
            >
              <label className="text-xs text-gray-500 block mb-1">
                Votre Email
              </label>
              <input
                type="email"
                {...register("email")}
                className="w-full bg-transparent text-gray-800 font-medium focus:outline-none"
                placeholder="email@tamari.com"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div
              className={`relative border rounded-2xl p-4 transition-colors bg-card ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            >
              <label className="text-xs text-gray-500 block mb-1">
                Mot de passe
              </label>

              <div className="flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="w-full bg-transparent text-gray-800 font-medium focus:outline-none"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-gray-500 hover:text-gray-800 transition-colors"
                >
                  {showPassword ? (
                    <Icon icon="bi:eye-slash" className="w-5 h-5" />
                  ) : (
                    <Icon icon="bi:eye" className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-blue-900 focus:ring-blue-900"
              />
              <span className="text-sm text-gray-600">Se souvenir de moi</span>
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-blue-900 hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          {/* Mobile Register Link */}
          <nav className="flex md:hidden gap-6 font-medium text-gray-700 text-base">
            <span className="hover:text-orange-500">
              Vous n'avez pas de compte ?
            </span>
            <Link
              href="/auth/register"
              className="text-blue-900 hover:underline"
            >
              Inscrivez-vous
            </Link>
          </nav>

          {/* Submit */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isLoggingIn}
              className="px-10 py-3 rounded-full bg-blue-900 hover:bg-blue-800 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? (
                <span className="flex items-center gap-2">
                  <Icon
                    icon="bi:arrow-repeat"
                    className="w-4 h-4 animate-spin"
                  />
                  Connexion...
                </span>
              ) : (
                "Se Connecter"
              )}
            </Button>
          </div>
        </form>

        {/* Desktop Register Link */}
        <div className="hidden md:block text-center mt-6">
          <p className="text-gray-600">
            Vous n'avez pas de compte ?{" "}
            <Link
              href="/auth/register"
              className="text-blue-900 font-medium hover:underline"
            >
              Inscrivez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

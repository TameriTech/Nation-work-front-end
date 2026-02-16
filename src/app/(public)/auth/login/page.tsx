"use client";
import { Icon } from "@iconify/react";
import { Button } from "@/app/components/ui/button";
import { useLogin } from "@/app/hooks/use-login";
import { useState } from "react";
import { useAuthStore } from "@/app/stores/auth.store";
import { useRouter, useSearchParams } from "next/navigation";

const LoginPage = () => {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password123");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const safeRedirect = redirect && redirect.startsWith("/") ? redirect : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setErrors({});

    // Validation simple côté client
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "L'email est requis";
    if (!password) newErrors.password = "Le mot de passe est requis";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    // Appel API pour la connexion

    try {
      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.message || "Login failed");
        return;
      }

      const data = await res.json();
      setUser(data);

      console.log(data);

      // Redirection selon le rôle
      if (safeRedirect) {
        router.replace(safeRedirect);
      } else if (data.user.role && data.user.role === "admin") {
        router.replace("/dashboard/admin");
      } else if (data.user.role && data.user.role === "client") {
        router.replace("/dashboard/customer");
      } else if (data.user.role && data.user.role === "freelancer") {
        router.replace("/dashboard/freelancer");
      }
    } catch (err) {
      console.log(err);

      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-3xl flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-card rounded-3xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Connectez-vous à votre compte
          </h1>

          <p className="text-lg text-gray-600 font-medium">
            Heureux de vous revoir parmi nous
          </p>

          {/* Email */}
          <div className="relative border-2 border-login rounded-2xl p-4 focus-within:border-login transition-colors bg-card">
            <label className="text-xs text-gray-500 block mb-1">
              Votre Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent text-gray-800 font-medium focus:outline-none"
              placeholder="email@tamari.com"
            />
          </div>

          {/* Password */}
          <div className="relative border border-gray-300 rounded-2xl p-4 focus-within:border-login transition-colors bg-card">
            <label className="text-xs text-gray-500 block mb-1">
              Mot de passe
            </label>

            <div className="flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <nav className="flex md:hidden gap-6 font-medium text-gray-700 text-base">
            <span className="hover:text-orange-500">
              {"Vous avez déjà un compte ?"}
            </span>
            <a href="/auth/register" className="text-blue-900">
              Inscrivez-vous
            </a>
          </nav>

          {/* Submit */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="px-10 py-3 rounded-full bg-blue-900 hover:bg-blue-800 text-white font-medium"
            >
              {loading ? "..." : "Se Connecter"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

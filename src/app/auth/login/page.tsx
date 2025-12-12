"use client";
import { Icon } from "@iconify/react";
import { Button } from "@/app/components/ui/button";
import { useLogin } from "@/contexts/LoginContext";

const LoginPage = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    loading,
    submit,
  } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

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

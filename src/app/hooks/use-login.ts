// hooks/use-login.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/LoginContext";
import { useToast } from "@/app/hooks/use-toast";

export function useLogin() {
  const { toast } = useToast();
  const { loginUser } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("freelancer@gmail.com");
  const [password, setPassword] = useState("Ludivin123");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);


  const submit = async () => {
    setLoading(true);
    try {
      const res = await login({ email, password });

      loginUser(res);

      toast({ title: "Connexion réussie" });
      localStorage.setItem("access_token", res.access_token);
      
      // Redirect basé sur rôle
      if (res.user_role === "freelancer") {
        router.push("/dashboard/freelancer");
      } else if (res.user_role === "client") {
        router.push("/dashboard/customer");
      } else if (res.user_role === "admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/");
      }
    } catch (e: any) {
      toast({
        title: "Erreur de connexion",
        description: e.message,
        variant: "destructive",
      });
      
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    submit,
    showPassword,
    setShowPassword,
  };
}

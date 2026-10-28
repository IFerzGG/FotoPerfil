import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { getMeService, loginService } from "../services/auth.service";
import { getErrorMessage } from "../api/axios";
import type { LoginRequest } from "../types/user";

export function Login() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [errorApi, setErrorApi] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>();

  // Si ya hay sesión, directo al dashboard
  if (token && user) return <Navigate to="/dashboard" replace />;

  async function onSubmit(data: LoginRequest) {
    setErrorApi(null);
    try {
      // 1) Login → token
      const res = await loginService(data);
      setToken(res.access_token);
      // 2) Con el token pedimos el perfil completo (id, avatar_url, etc.)
      const perfil = await getMeService();
      setUser(perfil);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      logout();
      setErrorApi(getErrorMessage(err));
    }
  }

  const input =
    "mt-2 w-full rounded-xl border border-[#e1e5db] bg-[#fbfcf8] px-4 py-3 text-sm outline-none transition placeholder:text-[#a2aba0] focus:border-[#679275] focus:ring-4 focus:ring-[#e4f0e8]";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f6f1] px-4 py-8">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-[2rem] border border-[#e7e9e1] bg-[#fffefa] shadow-[0_28px_90px_-50px_#536b55] md:grid-cols-2">
        <div className="relative hidden min-h-[570px] overflow-hidden bg-[#245b3f] p-10 text-white md:flex md:flex-col md:justify-between">
          <div className="absolute -right-24 top-20 h-80 w-80 rounded-full border border-white/15"/><div className="absolute -right-12 top-32 h-56 w-56 rounded-full border border-white/15"/>
          <p className="relative text-xl font-extrabold tracking-tight">folia<span className="ml-2 text-[#b7d0b9]">✳</span></p>
          <div className="relative"><p className="text-xs font-bold tracking-[.25em] text-[#bad2bd]">UN ESPACIO PARA TI</p><p className="mt-4 font-serif text-5xl leading-[1.08]">Lo cotidiano también puede ser especial.</p><p className="mt-5 max-w-xs text-sm leading-6 text-[#c7d8ca]">Entra a tu espacio personal y continúa donde lo dejaste.</p></div>
          <p className="relative text-xs text-[#b3c9b6]">Hecho con calma · folia 2026</p>
        </div>
        <div className="p-7 sm:p-10 md:flex md:flex-col md:justify-center">
          <p className="mb-8 text-center text-xl font-extrabold tracking-tight text-[#245b3f] md:hidden">folia ✳</p>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#92a092]">QUÉ BUENO VERTE</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#24352c]">Iniciar sesión</h1>
          <p className="mt-2 text-sm text-[#89948a]">Ingresa tus datos para continuar.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Correo</span>
              <input
                type="email"
                autoComplete="email"
                className={input}
                {...register("email", {
                  required: "El correo es obligatorio.",
                  pattern: { value: /^\S+@\S+\.\S+$/, message: "Correo inválido." },
                })}
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Contraseña</span>
              <input
                type="password"
                autoComplete="current-password"
                className={input}
                {...register("password", { required: "La contraseña es obligatoria." })}
              />
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
            </label>

            {errorApi && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errorApi}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-brand-600 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {isSubmitting ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#89948a]">
            ¿No tenés cuenta?{" "}
            <Link to="/register" className="font-bold text-[#39714e] hover:underline">
              Registrate
            </Link>
          </p>
          <p className="mt-5 text-center text-xs leading-5 text-[#9aa39a]">
          La API está en Render: si estuvo inactiva, el primer ingreso puede tardar ~30 segundos.
          </p>
        </div>
      </div>
    </div>
  );
}

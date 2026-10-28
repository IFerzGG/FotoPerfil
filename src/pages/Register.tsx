import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { getMeService, loginService, registerService } from "../services/auth.service";
import { getErrorMessage } from "../api/axios";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmar: string;
}

export function Register() {
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();
  const [errorApi, setErrorApi] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>();

  async function onSubmit(data: RegisterForm) {
    setErrorApi(null);
    try {
      // El registro crea un "cliente" pero NO devuelve token → hacemos login automático
      await registerService({ name: data.name.trim(), email: data.email.trim(), password: data.password });
      const res = await loginService({ email: data.email.trim(), password: data.password });
      setToken(res.access_token);
      setUser(await getMeService());
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setErrorApi(getErrorMessage(err));
    }
  }

  const input =
    "mt-2 w-full rounded-xl border border-[#e1e5db] bg-[#fbfcf8] px-4 py-3 text-sm outline-none transition focus:border-[#679275] focus:ring-4 focus:ring-[#e4f0e8]";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f6f1] px-4 py-8">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-[2rem] border border-[#e7e9e1] bg-[#fffefa] shadow-[0_28px_90px_-50px_#536b55] md:grid-cols-2">
        <div className="relative hidden min-h-[650px] flex-col justify-between overflow-hidden bg-[#245b3f] p-10 text-white md:flex">
          <div className="absolute -right-24 top-20 h-80 w-80 rounded-full border border-white/15"/><p className="relative text-xl font-extrabold">folia <span className="text-[#b7d0b9]">✳</span></p>
          <div className="relative"><p className="text-xs font-bold tracking-[.25em] text-[#bad2bd]">EMPIEZA POR AQUÍ</p><p className="mt-4 font-serif text-5xl leading-[1.08]">Un lugar propio, a tu manera.</p><p className="mt-5 max-w-xs text-sm leading-6 text-[#c7d8ca]">Crea tu cuenta y haz de este espacio algo tuyo.</p></div>
          <p className="relative text-xs text-[#b3c9b6]">Hecho con calma · folia 2026</p>
        </div>
        <div className="p-7 sm:p-10">
        <p className="mb-6 text-center text-xl font-extrabold text-[#245b3f] md:hidden">folia ✳</p>
        <p className="text-xs font-bold uppercase tracking-[.2em] text-[#92a092]">BIENVENIDO/A</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#24352c]">Crear cuenta</h1>
        <p className="mt-2 text-sm text-[#89948a]">Completa tus datos para comenzar.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Nombre</span>
            <input className={input} {...register("name", { required: "El nombre es obligatorio.", minLength: { value: 2, message: "Mínimo 2 caracteres." } })} />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Correo</span>
            <input type="email" className={input} {...register("email", { required: "El correo es obligatorio.", pattern: { value: /^\S+@\S+\.\S+$/, message: "Correo inválido." } })} />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Contraseña</span>
            <input type="password" className={input} {...register("password", { required: "La contraseña es obligatoria.", minLength: { value: 6, message: "Mínimo 6 caracteres." } })} />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Repetir contraseña</span>
            <input type="password" className={input} {...register("confirmar", { validate: (v) => v === getValues("password") || "Las contraseñas no coinciden." })} />
            {errors.confirmar && <p className="mt-1 text-xs text-red-600">{errors.confirmar.message}</p>}
          </label>

          {errorApi && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errorApi}</p>}

          <button type="submit" disabled={isSubmitting} className="w-full rounded-lg bg-brand-600 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
            {isSubmitting ? "Creando cuenta..." : "Registrarme"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" className="font-bold text-[#39714e] hover:underline">Iniciá sesión</Link>
        </p>
        </div>
      </div>
    </div>
  );
}

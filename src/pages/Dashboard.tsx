import { useOutletContext } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Avatar } from "../components/Avatar";
import { getSaludo, normalizarRol } from "../utils/roles";
import type { LayoutContext } from "../components/Layout";

export function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const { abrirPerfil } = useOutletContext<LayoutContext>();
  if (!user) return null;
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#8b998d]">MI ESPACIO</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#24352c] md:text-4xl">{getSaludo(user.role, user.name)} <span className="text-[#89a58e]">✳</span></h1><p className="mt-2 text-sm text-[#7f8a80]">Qué bueno tenerte por aquí.</p></div>
        <span className="rounded-full border border-[#e4e8de] bg-[#fffefa] px-4 py-2 text-xs font-semibold text-[#738174]">Cuenta activa <span className="ml-1 text-[#5a9a6c]">●</span></span>
      </div>
      <section className="overflow-hidden rounded-[2rem] bg-[#245b3f] text-white shadow-[0_24px_60px_-36px_#245b3f]">
        <div className="grid md:grid-cols-[1.15fr_.85fr]">
          <div className="p-7 md:p-10">
            <p className="text-xs font-bold uppercase tracking-[.22em] text-[#bdd4c0]">TU PERFIL</p>
            <div className="mt-8 flex items-center gap-5"><Avatar src={user.avatar_url} nombre={user.name} size="xl" /><div className="min-w-0"><h2 className="truncate text-2xl font-bold">{user.name}</h2><p className="mt-1 break-all text-sm text-[#c1d3c4]">{user.email}</p><span className="mt-3 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold capitalize">{normalizarRol(user.role)}</span></div></div>
            <button onClick={abrirPerfil} className="mt-8 rounded-xl bg-[#f4eddb] px-5 py-3 text-sm font-bold text-[#245b3f] transition hover:bg-white">Editar mi perfil <span className="ml-2">↗</span></button>
          </div>
          <div className="relative flex min-h-52 items-end overflow-hidden bg-[#d7e3ce] p-7 text-[#245b3f] md:min-h-72 md:p-9">
            <div className="absolute -right-10 -top-20 h-72 w-72 rounded-full border-[1px] border-[#245b3f]/15"/><div className="absolute -right-2 -top-12 h-56 w-56 rounded-full border border-[#245b3f]/15"/><div className="absolute right-10 top-6 text-[8rem] leading-none text-[#789b78]/40">✳</div>
            <div className="relative"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#65816c]">UN BUEN COMIENZO</p><p className="mt-3 max-w-xs font-serif text-3xl leading-tight">Pequeños cambios, grandes ideas.</p><p className="mt-3 text-sm text-[#65816c]">Gracias por formar parte de folia.</p></div>
          </div>
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-3">
        {[{ n: "01", t: "Tu información", d: "Mantén tus datos al día." }, { n: "02", t: "Tu comunidad", d: "Un espacio hecho para compartir." }, { n: "03", t: "Tu ritmo", d: "Vuelve cuando quieras." }].map((item) => <article key={item.n} className="rounded-2xl border border-[#e7e9e1] bg-[#fffefa] p-5"><span className="text-xs font-bold tracking-widest text-[#9aac99]">{item.n}</span><h3 className="mt-5 font-bold">{item.t}</h3><p className="mt-1 text-sm text-[#879187]">{item.d}</p></article>)}
      </section>
    </div>
  );
}

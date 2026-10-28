import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { esAdmin, normalizarRol } from "../utils/roles";
import { Avatar } from "./Avatar";
import { PerfilModal } from "./PerfilModal";

export function Layout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [modalAbierto, setModalAbierto] = useState(false);
  if (!user) return null;

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive ? "bg-[#e4f0e8] text-[#245b3f]" : "text-[#65756b] hover:bg-[#f1f4ef] hover:text-[#245b3f]"}`;
  function salir() { logout(); navigate("/login"); }

  return (
    <div className="min-h-screen bg-[#f7f6f1] text-[#24352c] md:flex">
      <aside className="flex w-full flex-col border-b border-[#e6e8df] bg-[#fffefa] px-5 py-4 md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r md:px-6 md:py-8">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#245b3f] text-xl text-white">f.</span>
          <div><p className="font-extrabold tracking-tight">folia</p><p className="text-xs text-[#8b968b]">TIENDA CONSCIENTE</p></div>
        </div>
        <p className="mb-3 mt-9 hidden px-4 text-[10px] font-bold uppercase tracking-[.2em] text-[#a2aa9f] md:block">Espacio personal</p>
        <nav className="mt-5 flex gap-2 md:mt-0 md:flex-col">
          <NavLink to="/dashboard" className={navClass}><span>⌂</span> Mi espacio</NavLink>
          {esAdmin(user.role) && <NavLink to="/usuarios" className={navClass}><span>♧</span> Comunidad</NavLink>}
        </nav>
        <div className="mt-auto hidden rounded-2xl bg-[#f3f1e8] p-4 md:block">
          <p className="text-sm font-semibold">Un poco más simple.</p><p className="mt-1 text-xs leading-5 text-[#7b887d]">Tu cuenta, tu perfil y todo en su lugar.</p>
        </div>
        <div className="mt-5 flex items-center gap-3 border-t border-[#eceee7] pt-5 md:mt-6">
          <button onClick={() => setModalAbierto(true)} className="flex min-w-0 flex-1 items-center gap-3 text-left" title="Editar perfil">
            <Avatar src={user.avatar_url} nombre={user.name} size="sm" />
            <span className="min-w-0"><span className="block truncate text-sm font-bold">{user.name}</span><span className="block text-xs capitalize text-[#89948a]">{normalizarRol(user.role)}</span></span>
          </button>
          <button onClick={salir} className="rounded-lg px-2 py-2 text-xs font-semibold text-[#7c877d] hover:bg-[#f1f4ef]">Salir</button>
        </div>
      </aside>
      <main className="mx-auto w-full max-w-6xl px-5 py-8 md:px-10 md:py-11">
        <Outlet context={{ abrirPerfil: () => setModalAbierto(true) }} />
      </main>
      {modalAbierto && <PerfilModal onClose={() => setModalAbierto(false)} />}
    </div>
  );
}

export interface LayoutContext { abrirPerfil: () => void; }

import { useEffect, useMemo, useState } from "react";
import { getUsersService } from "../services/users.service";
import { getErrorMessage } from "../api/axios";
import { Avatar } from "../components/Avatar";
import { normalizarRol } from "../utils/roles";
import type { UserResponse } from "../types/user";

// Vista exclusiva del ADMIN: lista de usuarios de la plataforma
export function Usuarios() {
  const [usuarios, setUsuarios] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    getUsersService()
      .then(setUsuarios)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const filtrados = useMemo(() => {
    const t = busqueda.trim().toLowerCase();
    return usuarios.filter((u) => !t || u.name.toLowerCase().includes(t) || u.email.toLowerCase().includes(t));
  }, [usuarios, busqueda]);

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#8b998d]">COMUNIDAD</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#24352c]">Personas</h1>
          <p className="mt-1 text-sm text-[#7f8a80]">{usuarios.length} personas forman parte de folia</p>
        </div>
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre o correo..."
          className="w-full rounded-xl border border-[#e1e5db] bg-[#fffefa] px-4 py-3 text-sm outline-none focus:border-[#679275] sm:w-72"
        />
      </div>

      {loading && <p className="rounded-2xl border border-[#e7e9e1] bg-[#fffefa] py-12 text-center text-[#7f8a80]">Cargando comunidad...</p>}
      {error && <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-2xl border border-[#e7e9e1] bg-[#fffefa]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f5f5ef] text-[10px] uppercase tracking-[.16em] text-[#89948a]">
              <tr>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Correo</th>
                <th className="px-4 py-3">Rol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eff0e9]">
              {filtrados.map((u) => {
                const rol = normalizarRol(u.role);
                return (
                  <tr key={u.id} className="transition hover:bg-[#fafbf7]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar src={u.avatar_url} nombre={u.name} size="sm" />
                        <span className="font-semibold text-[#34463a]">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#778379]">{u.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                          rol === "admin" ? "bg-[#f0e9db] text-[#87683c]" : "bg-[#e4f0e8] text-[#39714e]"
                        }`}
                      >
                        {rol}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center text-[#89948a]">No hay personas que coincidan con la búsqueda.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

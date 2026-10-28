import { Link } from "react-router-dom";

export function NoAutorizado() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl">🔒</p>
      <h1 className="mt-4 text-2xl font-extrabold text-[#24352c]">No tenés acceso a esta sección</h1>
      <p className="mt-2 text-[#7f8a80]">Solo los administradores pueden ver la lista de usuarios.</p>
      <Link to="/dashboard" className="mt-6 rounded-xl bg-[#245b3f] px-5 py-3 font-bold text-white">
        Volver al dashboard
      </Link>
    </div>
  );
}

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-extrabold text-[#24352c]">404 · Página no encontrada</h1>
      <Link to="/dashboard" className="mt-6 rounded-xl bg-[#245b3f] px-5 py-3 font-bold text-white">
        Ir al inicio
      </Link>
    </div>
  );
}

import { NavLink, Outlet } from "react-router-dom";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-4 py-2 text-sm font-bold transition ${isActive ? "bg-white text-slate-900 shadow" : "text-slate-500 hover:text-slate-700"}`;

export function AppLayout() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-14 pt-8">
      <header className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">LeetCode Spaced Repetition</p>
          <h1 className="mt-1 text-3xl font-extrabold">Leet Repeat</h1>
        </div>
        <nav className="inline-flex rounded-xl bg-indigo-100 p-1.5">
          <NavLink to="/" className={navClass} end>
            Today
          </NavLink>
          <NavLink to="/add" className={navClass}>
            Add Problem
          </NavLink>
          <NavLink to="/settings" className={navClass}>
            Settings
          </NavLink>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
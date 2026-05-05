import { NavLink, Outlet } from "react-router-dom";

type AppLayoutProps = {
  userId: string;
};

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-4 py-2 text-sm font-bold transition ${isActive ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`;

export function AppLayout({ userId }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_0%,#eef2ff_0%,#f8fafc_40%,#f8fafc_100%)]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-8 pt-8">
        <header className="mb-5 rounded-2xl border border-indigo-100/70 bg-white/80 px-5 py-4 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-600">LeetCode Spaced Repetition</p>
              <h1 className="mt-1 text-3xl font-extrabold text-slate-900">Leet Repeat</h1>
              <p className="mt-2 text-sm text-slate-600">Hi, guest user {userId} (please save this id if u want to move to another browser)</p>
            </div>
            <nav className="inline-flex rounded-xl border border-indigo-100 bg-indigo-50/80 p-1.5">
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
          </div>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>

        <footer className="mt-8 rounded-2xl border border-slate-200 bg-white/85 px-5 py-5 text-sm leading-6 text-slate-600 shadow-sm backdrop-blur">
          <p className="font-semibold text-slate-900">Have feedback or questions?</p>
          <p>If you have any feedback or questions, feel free to email us! We will get back to you as soon as possible.</p>
          <a className="font-semibold text-indigo-700 hover:text-indigo-800" href="mailto:ngocanhpham220299@gmail.com">
            ngocanhpham220299@gmail.com
          </a>
        </footer>
      </div>
    </div>
  );
}

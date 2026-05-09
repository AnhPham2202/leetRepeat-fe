import { FormEvent, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { api } from "../api";

type AppLayoutProps = {
  userId: string;
  onUserIdChange: (userId: string) => void;
};

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-4 py-2 text-sm font-bold transition ${isActive ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`;

export function AppLayout({ userId, onUserIdChange }: AppLayoutProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginUserId, setLoginUserId] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginMessage, setLoginMessage] = useState<string | null>(null);
  const [isCheckingUser, setIsCheckingUser] = useState(false);

  const toggleLogin = () => {
    setIsLoginOpen((current) => !current);
    setLoginError(null);
    setLoginMessage(null);
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextUserId = loginUserId.trim();
    setLoginError(null);
    setLoginMessage(null);

    if (!nextUserId) {
      setLoginError("Enter a user id.");
      return;
    }

    if (nextUserId === userId) {
      setLoginMessage("You are already using this user id.");
      return;
    }

    setIsCheckingUser(true);
    try {
      const { exists } = await api.userExists(nextUserId);
      if (!exists) {
        setLoginError("User id does not exist.");
        return;
      }

      onUserIdChange(nextUserId);
      setLoginUserId("");
      setIsLoginOpen(false);
      setLoginMessage("User id switched.");
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Could not check user id.");
    } finally {
      setIsCheckingUser(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_0%,#eef2ff_0%,#f8fafc_40%,#f8fafc_100%)]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-8 pt-8">
        <header className="mb-5 rounded-2xl border border-indigo-100/70 bg-white/80 px-5 py-4 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-600">LeetCode Spaced Repetition</p>
              <h1 className="mt-1 text-3xl font-extrabold text-slate-900">Leet's Repeat</h1>
              <div className="mt-2 flex flex-col gap-2 text-sm text-slate-600 sm:flex-row sm:items-center">
                <p>
                  Hi, guest user <span className="font-semibold text-slate-900">{userId}</span>. Save this id if you want to move to another browser.
                </p>
                <button
                  className="w-fit rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-100"
                  onClick={toggleLogin}
                  type="button"
                >
                  {isLoginOpen ? "Cancel" : "Use old id"}
                </button>
              </div>
              {isLoginOpen && (
                <form className="mt-3 flex flex-col gap-2 sm:max-w-md sm:flex-row sm:items-center" onSubmit={handleLogin}>
                  <input
                    className="min-h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    value={loginUserId}
                    onChange={(event) => setLoginUserId(event.target.value)}
                    placeholder="Old user id"
                  />
                  <button
                    className="min-h-10 rounded-lg bg-indigo-600 px-4 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
                    disabled={isCheckingUser}
                    type="submit"
                  >
                    {isCheckingUser ? "Checking..." : "Use this id"}
                  </button>
                </form>
              )}
              {(loginError || loginMessage) && (
                <p className={`mt-2 text-sm font-medium ${loginError ? "text-red-600" : "text-emerald-700"}`}>{loginError ?? loginMessage}</p>
              )}
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
          <p>If you have any feedback or questions, feel free to email me! Kinda free, I will do it</p>
          <a className="font-semibold text-indigo-700 hover:text-indigo-800" href="mailto:ngocanhpham220299@gmail.com">
            ngocanhpham220299@gmail.com
          </a>
        </footer>
      </div>
    </div>
  );
}

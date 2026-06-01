import { Bell, ChevronDown, ClipboardList, LayoutDashboard, PenSquare } from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

export function AppLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-white text-[#1f2937]">
      <aside className="fixed left-0 top-0 z-20 h-screen w-[180px] border-r border-[#eef1f6] bg-white">
        <Link to="/dashboard" className="flex h-[58px] items-center px-5">
          <span className="text-[20px] font-bold text-[#2563eb]">PrepRoute</span>
        </Link>

        <nav className="mt-3 space-y-1 px-3 text-[12px]">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex h-9 items-center gap-2 rounded-[6px] px-3 ${
                isActive
                  ? "bg-[#f1f5ff] text-[#4f73df]"
                  : "text-[#667085] hover:bg-[#f8fafc]"
              }`
            }
          >
            <LayoutDashboard size={14} />
            Dashboard
          </NavLink>

          <NavLink
            to="/tests/create"
            className={({ isActive }) =>
              `flex h-9 items-center gap-2 rounded-[6px] px-3 ${
                isActive
                  ? "bg-[#f1f5ff] text-[#4f73df]"
                  : "text-[#667085] hover:bg-[#f8fafc]"
              }`
            }
          >
            <PenSquare size={14} />
            Test Creation
          </NavLink>

          <NavLink
            to="/tracking"
            className="flex h-9 items-center gap-2 rounded-[6px] px-3 text-[#667085] hover:bg-[#f8fafc]"
          >
            <ClipboardList size={14} />
            Test Tracking
          </NavLink>
        </nav>
      </aside>

      <div className="pl-[180px]">
        <header className="sticky top-0 z-10 flex h-[58px] items-center justify-end border-b border-[#eef1f6] bg-white px-6">
          <button className="mr-4 flex h-8 w-8 items-center justify-center rounded-full border border-[#e5e7eb]">
            <Bell size={15} />
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5a55f] text-sm font-semibold text-white">
              A
            </div>
            <div>
              <p className="text-[12px] font-semibold text-[#111827]">Alex Wando</p>
              <p className="text-[10px] text-[#667085]">Admin</p>
            </div>
            <ChevronDown size={14} />
          </div>

          <button
            onClick={handleLogout}
            className="ml-5 text-[12px] font-medium text-red-500"
          >
            Logout
          </button>
        </header>

        <main className="min-h-[calc(100vh-58px)] bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
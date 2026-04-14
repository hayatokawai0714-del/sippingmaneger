import { Link, Outlet, useLocation } from 'react-router-dom';
import { CalendarDays, Database, FileText, Home, Package, Settings } from 'lucide-react';

const tabs = [
  { to: '/', label: 'カレンダー', icon: CalendarDays },
  { to: '/today', label: '今日', icon: Home },
  { to: '/register', label: '登録', icon: Package },
  { to: '/destinations', label: '出荷先', icon: FileText },
  { to: '/units', label: '単位', icon: Settings },
  { to: '/data', label: '入出力', icon: Database },
] as const;

export const AppShell = () => {
  const location = useLocation();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col text-ink">
      <header className="sticky top-0 z-20 border-b border-line bg-paper/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-emerald-700/80">
              Shipping Manager
            </p>
            <h1 className="text-base font-semibold">出荷・予定管理アプリ</h1>
          </div>
        </div>

        <div className="mt-3 hidden gap-2 md:flex md:flex-wrap">
          {tabs.map((tab) => {
            const active = location.pathname === tab.to;
            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? 'border-accent bg-accent text-white'
                    : 'border-line bg-white text-ink hover:bg-mist'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </header>

      <main className="flex-1 px-3 pb-24 pt-4 sm:px-4">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-line bg-paper/95 backdrop-blur md:hidden">
        <ul className="grid grid-cols-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = location.pathname === tab.to;
            return (
              <li key={tab.to}>
                <Link
                  to={tab.to}
                  className={`flex flex-col items-center gap-1 py-2 text-[11px] font-medium transition ${
                    active ? 'text-accent' : 'text-emerald-900/65'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

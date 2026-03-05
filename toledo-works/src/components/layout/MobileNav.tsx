import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Wrench, User, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavTab {
  to: string;
  label: string;
  icon: typeof Home;
}

const tabs: NavTab[] = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/jobs', label: 'Jobs', icon: Search },
  { to: '/trades', label: 'Trades', icon: Wrench },
];

export default function MobileNav() {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const profileTab: NavTab = user
    ? { to: '/profile', label: 'Profile', icon: User }
    : { to: '/login', label: 'Log In', icon: LogIn };

  const allTabs = [...tabs, profileTab];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {allTabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.to);

          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 text-xs font-medium font-body transition-colors ${
                active
                  ? 'text-orange'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon
                className={`w-5 h-5 ${active ? 'stroke-[2.5]' : 'stroke-[1.5]'}`}
              />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

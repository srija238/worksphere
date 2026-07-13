import { DashboardIcon, type DashboardIconName } from './DashboardIcons';

interface SidebarNavigationItem {
  label: string;
  icon: DashboardIconName;
}

// Add future dashboard navigation items here.
const sidebarNavigation: SidebarNavigationItem[] = [
  { label: 'Dashboard', icon: 'grid' },
  { label: 'Projects', icon: 'folder' },
  { label: 'Workitems', icon: 'list' },
  { label: 'Users', icon: 'user' },
  { label: 'Settings', icon: 'settings' },
];

interface DashboardSidebarProps {
  isOpen: boolean;
  onNavigate: () => void;
}

export function DashboardSidebar({ isOpen, onNavigate }: DashboardSidebarProps) {
  return <aside className={`fixed bottom-0 left-0 top-[72px] z-40 w-52 border-r border-[#7e9eb429] bg-[#071724bd] px-[9px] py-4 transition-transform max-[1024px]:w-[190px] max-[1024px]:-translate-x-full max-[1024px]:shadow-2xl max-[700px]:top-16 ${isOpen ? 'max-[1024px]:translate-x-0' : ''}`}>
    <nav className="flex flex-col gap-1">
      {sidebarNavigation.map((item, index) => <button
        type="button"
        key={item.label}
        className={`relative flex h-[47px] w-full items-center gap-5 rounded-[7px] border-0 px-[19px] text-left text-[#f2f5f8] ${index === 0 ? 'border-l-2 border-l-[#ff5a16] bg-[linear-gradient(90deg,rgba(29,48,64,.9),rgba(27,45,60,.85))]' : 'bg-transparent hover:bg-white/5'}`}
        onClick={onNavigate}
      >
        <DashboardIcon name={item.icon} className={`h-[22px] w-[22px] shrink-0 ${index === 0 ? 'text-[#ff5a16]' : 'text-[#c7d1dc]'}`}/>
        <span className="text-[13px]">{item.label}</span>
      </button>)}
    </nav>
  </aside>;
}

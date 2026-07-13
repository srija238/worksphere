import type { SVGProps } from 'react';

export type DashboardIconName =
  | 'grid' | 'folder' | 'list' | 'user' | 'bell' | 'settings' | 'menu'
  | 'search' | 'chevron' | 'briefcase' | 'users' | 'clipboard' | 'clock'
  | 'dots' | 'refresh' | 'alert' | 'close' | 'sort' | 'arrow-up' | 'arrow-down';

export function DashboardIcon({ name, ...props }: { name: DashboardIconName } & SVGProps<SVGSVGElement>) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const paths: Record<DashboardIconName, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    folder: <><path d="M3 7.5h7l2-2h9v14H3z"/><path d="M3 9.5h18"/></>,
    list: <><path d="M9 6h12M9 12h12M9 18h12"/><path d="M3.5 6h.1M3.5 12h.1M3.5 18h.1" strokeWidth="3"/></>,
    user: <><circle cx="12" cy="8" r="3"/><circle cx="12" cy="12" r="9"/><path d="M7.5 18a5 5 0 0 1 9 0"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.09A1.7 1.7 0 0 0 8.5 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3v-4h.09A1.7 1.7 0 0 0 4.6 8.5a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.09A1.7 1.7 0 0 0 15.5 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.15.38.4.72.72.97.31.25.7.4 1.1.4H21v4h-.09A1.7 1.7 0 0 0 19.4 15z"/></>,
    menu: <path d="M4 6h16M4 12h16M4 18h16"/>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    chevron: <path d="m8 10 4 4 4-4"/>,
    briefcase: <><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><rect x="3" y="7" width="18" height="14" rx="2"/></>,
    users: <><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v2"/><path d="M16 5.5a3 3 0 0 1 0 5M17 14a5 5 0 0 1 4 4.9V20"/></>,
    clipboard: <><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M9 5V3h6v2M8 11h8M8 16h5"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/></>,
    dots: <><circle cx="12" cy="5" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none"/></>,
    refresh: <><path d="M20 6v5h-5"/><path d="M18.5 15a7 7 0 1 1-.4-6.5L20 11"/></>,
    alert: <><path d="M12 3 2.5 20h19z"/><path d="M12 9v5M12 17.5h.01"/></>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
    sort: <><path d="m8 9 4-4 4 4"/><path d="m8 15 4 4 4-4"/></>,
    'arrow-up': <><path d="m7 11 5-5 5 5"/><path d="M12 6v12"/></>,
    'arrow-down': <><path d="m7 13 5 5 5-5"/><path d="M12 18V6"/></>,
  };

  return <svg viewBox="0 0 24 24" aria-hidden="true" {...common} {...props}>{paths[name]}</svg>;
}

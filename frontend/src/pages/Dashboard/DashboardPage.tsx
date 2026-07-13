import { useCallback, useRef, useState, type RefObject } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { ErrorState } from '../../components/ErrorState';
import { SkeletonBlock } from '../../components/SkeletonBlock';
import { Table } from '../../components/Table';
import { useApiRequest } from '../../hooks/useApiRequest';
import { formatDate, formatRelativeTime } from '../../utils/date';
import { logout } from '../Login/authApi';
import { DashboardIcon as Icon, type DashboardIconName as IconName } from './DashboardIcons';
import { DashboardSidebar } from './DashboardSidebar';
import { getDashboard, getProjects } from './dashboardApi';
import { ProjectTable } from './components/ProjectTable';
import { ProjectsDrawer } from './components/ProjectsDrawer';
import type { DashboardResponse, RecentActivity } from './types';

function getDashboardPageData(signal?: AbortSignal) {
  return Promise.all([getDashboard(signal), getProjects(signal)]);
}

const statusMeta: Record<string, { label: string; color: string; dotClass: string }> = {
  in_progress: { label: 'In Progress', color: '#2488ff', dotClass: 'bg-[#2488ff]' },
  todo: { label: 'To Do', color: '#ffb313', dotClass: 'bg-[#ffb313]' },
  under_review: { label: 'Under Review', color: '#9259db', dotClass: 'bg-[#9259db]' },
  done: { label: 'Completed', color: '#40bd72', dotClass: 'bg-[#40bd72]' },
  completed: { label: 'Completed', color: '#40bd72', dotClass: 'bg-[#40bd72]' },
};

const panelClass = 'min-w-0 overflow-hidden rounded-lg border border-[#7e9eb429] bg-[linear-gradient(135deg,rgba(11,31,47,.86),rgba(8,27,42,.73))]';
const panelHeadingClass = 'flex h-[60px] items-center justify-between px-[21px]';
const panelTitleClass = 'm-0 text-[17px] font-semibold leading-tight tracking-normal text-[#f6f8fb]';
const panelActionClass = 'border-0 bg-transparent p-0 text-xs font-medium text-[#ff5a16]';
const tableHeadClass = 'h-[37px] text-left text-[11.5px] font-normal text-[#ecf1f6]';
const tableCellClass = 'h-12 whitespace-nowrap border-t border-[#7e9eb41c] text-[11.5px] text-[#f5f7f9]';

function activityAction(activity: RecentActivity) {
  if (!activity.action.includes('.')) return activity.action;
  const actions: Record<string, string> = {
    'project.created': 'created a new project',
    'task.created': 'created a workitem',
    'task.updated': 'updated workitem status',
    'task.completed': 'completed workitem',
    'sprint.started': 'started a new sprint',
  };
  return actions[activity.action] ?? activity.action.replace('.', ' ');
}

function Brand() {
  return <div className="flex items-center gap-[9px] whitespace-nowrap text-xl font-bold text-white">
    <svg className="h-[29px] w-[29px] fill-[#ff5317]" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 1.5 2.9 6.2 6.7.6-5 4.5 1.5 6.6-6.1-3.5-6.1 3.5 1.5-6.6-5-4.5 6.7-.6z"/></svg>
    <span>Work<span className="text-[#ff5317]">Sphere</span></span>
  </div>;
}

function DashboardSkeleton() {
  return <div aria-label="Loading dashboard" role="status">
    <section className="mb-0 flex h-[75px] items-start max-[700px]:h-auto max-[700px]:mb-[22px]">
      <div><SkeletonBlock className="mb-[9px] h-[25px] w-[218px]"/><SkeletonBlock className="h-[11px] w-[315px] max-w-[75vw]"/></div>
    </section>
    <section className="mb-4 grid grid-cols-4 gap-[19px] max-[1240px]:gap-3 max-[1024px]:grid-cols-2 max-[700px]:grid-cols-1">
      {Array.from({ length: 4 }, (_, index) => <Card className="flex h-[104px] items-center gap-[21px] rounded-[7px] border border-[#7e9eb429] bg-[#0d2334eb] p-5 max-[1240px]:gap-[13px] max-[1240px]:px-4" key={index}>
        <SkeletonBlock className="h-[58px] w-[58px] shrink-0 rounded-xl"/>
        <div className="space-y-[9px]"><SkeletonBlock className="h-[11px] w-[82px]"/><SkeletonBlock className="h-[29px] w-12"/></div>
      </Card>)}
    </section>
    <section className="mb-4 grid grid-cols-[1.22fr_1fr] gap-[17px] max-[1024px]:grid-cols-1">
      <SkeletonPanel rows={5}/><SkeletonChart/>
    </section>
    <section className="grid grid-cols-[1.23fr_1fr] gap-[17px] max-[1024px]:grid-cols-1">
      <SkeletonPanel rows={4} wide/><SkeletonActivity/>
    </section>
    <span className="sr-only">Loading dashboard data</span>
  </div>;
}

function SkeletonPanel({ rows, wide = false }: { rows: number; wide?: boolean }) {
  return <Card className={`${panelClass} h-[341px] max-[1024px]:h-auto max-[1024px]:min-h-[336px]`}>
    <div className={panelHeadingClass}><SkeletonBlock className={`h-4 ${wide ? 'w-[218px]' : 'w-[142px]'}`}/><SkeletonBlock className="h-2.5 w-20"/></div>
    <div className="grid h-[37px] grid-cols-[1.4fr_.9fr_1fr_.8fr] items-center gap-[30px] px-[22px]">{Array.from({ length: 4 }, (_, index) => <SkeletonBlock className="h-2 w-1/2" key={index}/>)}</div>
    {Array.from({ length: rows }, (_, row) => <div className="grid h-12 grid-cols-[1.4fr_.9fr_1fr_.8fr] items-center gap-[30px] border-t border-[#7e9eb417] px-[22px]" key={row}>{Array.from({ length: 4 }, (_, cell) => <SkeletonBlock className="h-2.5 w-3/4" key={cell}/>)}</div>)}
  </Card>;
}

function SkeletonChart() {
  return <Card className={`${panelClass} h-[341px] max-[1024px]:h-auto max-[1024px]:min-h-[336px]`}>
    <div className={panelHeadingClass}><SkeletonBlock className="h-4 w-[142px]"/><SkeletonBlock className="h-[35px] w-[133px]"/></div>
    <div className="flex h-[244px] items-center gap-[51px] px-[34px] max-[1240px]:gap-[25px] max-[1240px]:px-[22px] max-[700px]:h-auto max-[700px]:flex-col max-[700px]:py-7">
      <SkeletonBlock className="h-[196px] w-[196px] shrink-0 rounded-full border-[20px] border-[#738fa421] max-[1240px]:h-[170px] max-[1240px]:w-[170px]"/>
      <div className="flex flex-1 flex-col gap-6 max-[700px]:w-full">{Array.from({ length: 4 }, (_, index) => <SkeletonBlock className="h-[11px] w-full" key={index}/>)}</div>
    </div>
  </Card>;
}

function SkeletonActivity() {
  return <Card className={`${panelClass} h-[336px] px-[21px] max-[1024px]:h-auto max-[1024px]:min-h-[336px]`}>
    <div className="flex h-[60px] items-center justify-between"><SkeletonBlock className="h-4 w-[142px]"/><SkeletonBlock className="h-2.5 w-20"/></div>
    {Array.from({ length: 5 }, (_, index) => <div className="flex min-h-[53px] items-center justify-between gap-6 border-b border-[#7e9eb417] px-[7px] py-[7px]" key={index}><div className="w-3/5 space-y-[7px]"><SkeletonBlock className="h-2.5 w-[88%]"/><SkeletonBlock className="h-[9px] w-[65%]"/></div><SkeletonBlock className="h-[9px] w-[43px]"/></div>)}
  </Card>;
}

interface DashboardContentProps {
  data: DashboardResponse;
  search: string;
  onViewAllProjects: () => void;
  viewAllProjectsRef: RefObject<HTMLButtonElement | null>;
}

function DashboardContent({ data, search, onViewAllProjects, viewAllProjectsRef }: DashboardContentProps) {
  const { dashboard } = data;
  const projects = (dashboard.projects_overview ?? []).filter((project) =>
    (project.project_name ?? '').toLowerCase().includes(search.trim().toLowerCase()),
  );
  const statuses = (dashboard.workitem_status?.items ?? []).map((item) => ({
    ...item,
    ...(statusMeta[(item.status ?? '').toLowerCase()] ?? { label: item.status || 'N/A', color: '#2488ff', dotClass: 'bg-[#2488ff]' }),
  }));
  const deadlines = dashboard.upcoming_project_deadlines ?? [];
  const activities = dashboard.recent_activity ?? [];
  let statusOffset = 0;
  const statusSegments = statuses.map((item) => {
    const offset = statusOffset;
    statusOffset += item.percentage ?? 0;
    return { ...item, offset };
  });
  const metricCards = [
    { label: 'Projects', value: dashboard.summary?.total_projects ?? 0, icon: 'briefcase' as IconName, tone: 'border-l-[#b55cf1]', iconTone: 'bg-[#8838c14d] text-[#b55cf1]' },
    { label: 'Total Users', value: dashboard.summary?.total_users ?? 0, icon: 'users' as IconName, tone: 'border-l-[#1679f5]', iconTone: 'bg-[#0f54b44f] text-[#1679f5]' },
    { label: 'Active Workitems', value: dashboard.summary?.active_workitems ?? 0, icon: 'clipboard' as IconName, tone: 'border-l-[#34c26a]', iconTone: 'bg-[#1e874c4d] text-[#34c26a]' },
    { label: 'Overdue Workitems', value: dashboard.summary?.overdue_workitems ?? 0, icon: 'clock' as IconName, tone: 'border-l-[#ff5448]', iconTone: 'bg-[#9a31275c] text-[#ff5448]' },
  ];

  return <>
    <section className="flex h-[75px] items-start max-[700px]:mb-[22px] max-[700px]:h-auto">
      <div><h1 className="m-0 mb-[5px] text-2xl font-semibold leading-tight tracking-normal text-[#f5f7fa]">Workspace Overview</h1><p className="text-xs text-[#c6ced8]">Stay updated with your projects, workitems, and team activity.</p></div>
    </section>

    <section className="mb-4 grid grid-cols-4 gap-[19px] max-[1240px]:gap-3 max-[1024px]:grid-cols-2 max-[700px]:grid-cols-1">{metricCards.map((card) => <Card className={`flex h-[104px] items-center gap-[21px] rounded-[7px] border border-[#7e9eb429] border-l-[3px] bg-[linear-gradient(135deg,rgba(13,35,52,.92),rgba(9,27,42,.74))] p-5 max-[1240px]:gap-[13px] max-[1240px]:px-4 max-[700px]:h-[94px] ${card.tone}`} key={card.label}><span className={`grid h-[58px] w-[58px] shrink-0 place-items-center rounded-xl ${card.iconTone}`}><Icon name={card.icon} className="h-[31px] w-[31px]"/></span><div className="flex flex-col gap-[7px]"><span className="text-xs font-semibold">{card.label}</span><strong className="text-[32px] font-medium leading-none tracking-normal text-[#f8fafc]">{card.value}</strong></div></Card>)}</section>

    <section className="mb-4 grid grid-cols-[1.22fr_1fr] gap-[17px] max-[1024px]:grid-cols-1">
      <Card className={`${panelClass} h-[341px] max-[1024px]:h-auto max-[1024px]:min-h-[336px]`}>
        <div className={panelHeadingClass}><h2 className={panelTitleClass}>Projects Overview</h2><button ref={viewAllProjectsRef} type="button" onClick={onViewAllProjects} className={panelActionClass}>View all projects</button></div>
        <div>{projects.length > 0 ? <ProjectTable
          projects={projects}
          getKey={(project, index) => `${project.project_name || 'project'}-${index}`}
          getProjectName={(project) => project.project_name}
          getManagerName={(project) => project.manager_name}
          getProgress={(project) => project.progress}
          getDueDate={(project) => project.due_date}
        /> : <EmptyState/>}</div>
      </Card>

      <Card className={`${panelClass} h-[341px] max-[1024px]:h-auto max-[1024px]:min-h-[336px]`}>
        <div className={panelHeadingClass}><h2 className={panelTitleClass}>Workitem Status</h2><button type="button" className="flex h-[35px] items-center gap-[22px] rounded-md border border-[#7e9eb429] bg-transparent px-3 text-xs font-normal text-[#f3f6f9]">All Projects <Icon name="chevron" className="h-4 w-4"/></button></div>
        {statuses.length > 0 ? <div className="flex h-[270px] items-center gap-[50px] px-[33px] max-[1240px]:gap-[25px] max-[1240px]:px-[22px] max-[700px]:h-auto max-[700px]:flex-col max-[700px]:px-[25px] max-[700px]:pb-6 max-[700px]:pt-2.5"><div className="relative grid h-[196px] w-[196px] shrink-0 place-items-center max-[1240px]:h-[170px] max-[1240px]:w-[170px]"><svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">{statusSegments.map((item, index) => <circle key={`${item.status || 'status'}-${index}`} cx="50" cy="50" r="42" fill="none" stroke={item.color} strokeWidth="10" pathLength="100" strokeDasharray={`${item.percentage ?? 0} ${100 - (item.percentage ?? 0)}`} strokeDashoffset={-item.offset}/>)}</svg><div className="z-10 grid h-[155px] w-[155px] place-items-center rounded-full bg-[#0a1d2c] max-[1240px]:h-[134px] max-[1240px]:w-[134px]"><span className="flex flex-col items-center"><strong className="text-[28px] font-medium leading-tight">{dashboard.workitem_status?.total ?? 0}</strong><span className="mt-1 text-xs">Total Workitems</span></span></div></div><ul className="m-0 flex-1 list-none p-0 max-[700px]:w-full">{statuses.map((item, index) => <li className="grid h-9 grid-cols-[12px_1fr_auto] items-center gap-3 text-[11.5px]" key={`${item.status || 'status'}-${index}`}><i className={`h-3 w-3 rounded-full ${item.dotClass}`}/><span>{item.label}</span><strong className="whitespace-nowrap font-normal">{item.count ?? 0} ({Math.round(item.percentage ?? 0)}%)</strong></li>)}</ul></div> : <EmptyState message="No data available" className="pt-24"/>}
      </Card>
    </section>

    <section className="grid grid-cols-[1.23fr_1fr] gap-[17px] max-[1024px]:grid-cols-1">
      <Card className={`${panelClass} h-[336px] max-[1024px]:h-auto max-[1024px]:min-h-[336px]`}>
        <div className={panelHeadingClass}><h2 className={panelTitleClass}>Upcoming Project Deadlines</h2><button type="button" className={panelActionClass}>View all</button></div>
        <div><Table className="w-full min-w-[610px] table-fixed border-collapse"><thead><tr><th className={`${tableHeadClass} w-[34%] pl-[21px]`}>Project</th><th className={`${tableHeadClass} w-[24%]`}>Manager</th><th className={`${tableHeadClass} w-[24%]`}>Due Date</th><th className={`${tableHeadClass} w-[18%]`}>Days Left</th></tr></thead><tbody>{deadlines.map((deadline, index) => { const daysLeft = deadline.days_left ?? 0; return <tr key={`${deadline.project_name || 'project'}-${deadline.due_date || index}`}><td className={`${tableCellClass} h-[50px] pl-[21px]`}>{deadline.project_name || 'N/A'}</td><td className={`${tableCellClass} h-[50px]`}>{deadline.manager_name || 'N/A'}</td><td className={`${tableCellClass} h-[50px]`}>{formatDate(deadline.due_date)}</td><td className={`${tableCellClass} h-[50px]`}><strong className={`pl-[23px] text-sm font-medium ${daysLeft <= 2 ? 'text-[#ff4a26]' : daysLeft <= 5 ? 'text-[#ff9d00]' : daysLeft <= 7 ? 'text-[#39c871]' : 'text-[#1684fb]'}`}>{daysLeft}</strong></td></tr>; })}</tbody></Table>{deadlines.length === 0 && <EmptyState/>}</div>
      </Card>
      <Card className={`${panelClass} h-[336px] px-[21px] max-[1024px]:h-auto max-[1024px]:min-h-[336px]`}>
        <div className="flex h-[60px] items-center"><h2 className={panelTitleClass}>Recent Activity</h2></div>
        {activities.length > 0 ? <ul className="m-0 list-none p-0">{activities.map((activity, index) => <li className="flex min-h-[53px] items-start justify-between gap-[15px] border-b border-[#7e9eb41c] px-[7px] pb-1.5 pt-2 last:border-0" key={`${activity.created_at || 'activity'}-${index}`}><div><p className="text-[11.5px] leading-[1.4] text-[#eaf0f5]"><strong className="font-semibold">{activity.actor_name || 'N/A'}</strong> {activity.action ? activityAction(activity) : 'N/A'}</p><span className="mt-px block text-[11.5px] text-[#b5c0cc]">{activity.entity_name || 'N/A'}</span></div><time className="whitespace-nowrap pt-0.5 text-[11.5px] text-[#b5c0cc]">{formatRelativeTime(activity.created_at)}</time></li>)}</ul> : <EmptyState className="pt-20"/>}
      </Card>
    </section>
  </>;
}

function DashboardPage() {
  const { data: pageData, loading, error, retry } = useApiRequest(getDashboardPageData);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [projectsDrawerOpen, setProjectsDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const viewAllProjectsRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const dashboardData = pageData?.[0] ?? null;
  const projectsData = pageData?.[1] ?? [];
  const closeProjectsDrawer = useCallback(() => setProjectsDrawerOpen(false), []);

  const user = dashboardData?.user;
  const role = dashboardData?.role;
  const roleLabel = role ? role[0] + role.slice(1).toLowerCase() : 'N/A';

  return <div className="min-h-screen bg-[#061522] bg-[radial-gradient(circle_at_53%_32%,rgba(19,59,86,.22),transparent_35%),linear-gradient(135deg,#071623_0%,#061522_62%,#071a29_100%)] text-left font-sans text-sm leading-[1.35] text-[#f7f9fc]">
    <header className="fixed inset-x-0 top-0 z-50 flex h-[72px] items-center border-b border-[#7e9eb429] bg-[#05121eeb] backdrop-blur-[18px] max-[700px]:h-16">
      <div className="flex h-[72px] w-52 shrink-0 items-center border-r border-[#7e9eb429] pl-[25px] max-[1024px]:w-[190px] max-[700px]:h-16 max-[700px]:w-auto max-[700px]:border-0 max-[700px]:pl-4 max-[470px]:hidden"><Brand/></div>
      <button type="button" className="grid h-[72px] w-[68px] place-items-center border-0 bg-transparent p-0 max-[700px]:order-first max-[700px]:h-16 max-[700px]:w-12" aria-label="Toggle navigation" aria-expanded={sidebarOpen} onClick={() => setSidebarOpen((value) => !value)}><Icon name="menu" className="h-[26px] w-[26px]"/></button>
      <label className="flex h-[42px] w-[462px] items-center gap-3.5 rounded-[7px] border border-[#7e9eb429] bg-[#04111c80] px-3 pl-3.5 text-[#c5d0dc] max-[1240px]:w-[min(38vw,462px)] max-[700px]:mr-[5px] max-[700px]:w-auto max-[700px]:flex-1 max-[470px]:h-[39px]"><Icon name="search" className="h-5 w-5 shrink-0"/><input className="min-w-0 flex-1 border-0 bg-transparent text-[13px] text-[#dce3eb] outline-none placeholder:text-[#aeb9c7]" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search projects, workitems..." disabled={!dashboardData}/><kbd className="shrink-0 rounded-[5px] border border-[#7e9eb424] px-[7px] py-[3px] font-sans text-[11px] font-normal text-[#acb6c1] max-[700px]:hidden">⌘ K</kbd></label>
      <div className="flex-1"/>
      <button type="button" className="relative grid h-12 w-12 place-items-center border-0 bg-transparent p-0 max-[700px]:w-[38px] max-[470px]:hidden" aria-label="Notifications"><Icon name="bell" className="h-[23px] w-[23px]"/><span className="absolute right-[5px] top-[5px] grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#fb4f14] px-1 text-[10px] font-bold text-white">8</span></button>
      {user ? <><button type="button" className="flex h-[72px] items-center gap-[13px] border-0 bg-transparent py-0 pl-3 pr-[25px] text-left max-[700px]:h-16 max-[700px]:py-0 max-[700px]:pl-[3px] max-[700px]:pr-[10px]" onClick={() => setProfileOpen((value) => !value)} aria-expanded={profileOpen}><span className="grid h-[42px] w-[42px] place-items-center rounded-full bg-[linear-gradient(145deg,#ff6a28,#f14408)] text-lg font-semibold text-white max-[700px]:h-[34px] max-[700px]:w-[34px] max-[700px]:text-[15px]">{user.initial || '?'}</span><span className="flex min-w-16 flex-col gap-0.5 max-[700px]:hidden"><strong className="text-[13px] font-medium">{user.name || 'N/A'}</strong><small className="text-xs text-[#c1c9d3]">{roleLabel}</small></span><Icon name="chevron" className="ml-1.5 h-[17px] w-[17px] max-[700px]:hidden"/></button>{profileOpen && <div className="absolute right-6 top-16 w-[130px] rounded-lg border border-[#7e9eb429] bg-[#0b2031] p-1.5 shadow-2xl"><button type="button" className="w-full rounded-[5px] border-0 bg-transparent px-2.5 py-2 text-left hover:bg-white/5" onClick={() => { logout(); navigate('/login', { replace: true }); }}>Sign out</button></div>}</> : <div className="mr-5 h-[42px] w-[132px] animate-pulse rounded-md bg-[#738fa421] max-[700px]:mr-3 max-[700px]:w-[42px]" aria-hidden="true"/>}
    </header>

    <DashboardSidebar isOpen={sidebarOpen} onNavigate={() => setSidebarOpen(false)}/>
    {sidebarOpen && <button type="button" className="fixed inset-x-0 bottom-0 top-[72px] z-[35] hidden border-0 bg-black/35 max-[1024px]:block max-[700px]:top-16" aria-label="Close navigation" onClick={() => setSidebarOpen(false)}/>} 

    <main className="ml-52 min-h-screen overflow-hidden px-10 pb-[45px] pl-[29px] pt-[89px] max-[1240px]:px-6 max-[1240px]:pb-[45px] max-[1240px]:pt-[89px] max-[1024px]:ml-0 max-[700px]:px-[15px] max-[700px]:pb-[30px] max-[700px]:pt-[79px]" aria-busy={loading}>
      {loading ? <DashboardSkeleton/> : error ? <ErrorState message={error} onRetry={retry} icon={<Icon name="alert" className="h-6 w-6"/>}/> : dashboardData ? <DashboardContent data={dashboardData} search={search} onViewAllProjects={() => setProjectsDrawerOpen(true)} viewAllProjectsRef={viewAllProjectsRef}/> : <ErrorState message="No dashboard data was returned." onRetry={retry}/>} 
    </main>
    <ProjectsDrawer isOpen={projectsDrawerOpen} onClose={closeProjectsDrawer} projects={projectsData} triggerRef={viewAllProjectsRef}/>
  </div>;
}

export default DashboardPage;

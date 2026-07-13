export interface DashboardSummary {
  total_projects: number;
  total_users: number;
  total_workitems: number;
  active_workitems: number;
  overdue_workitems: number;
}

export interface ProjectOverview {
  project_name: string;
  manager_name: string;
  progress: number;
  due_date: string | null;
}

export interface ProjectResponse {
  id: number;
  name: string;
  manager_name: string;
  progress: number;
  description: string | null;
  status: string;
  owner_id: number;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkitemStatusItem {
  status: string;
  count: number;
  percentage: number;
}

export interface UpcomingProjectDeadline {
  project_name: string;
  manager_name: string;
  due_date: string;
  days_left: number;
}

export interface RecentActivity {
  actor_name: string;
  action: string;
  entity_name: string;
  created_at: string;
}

export interface DashboardResponse {
  role: string;
  user: { id: number; name: string; initial: string };
  dashboard: {
    summary: DashboardSummary;
    projects_overview: ProjectOverview[];
    workitem_status: { total: number; items: WorkitemStatusItem[] };
    upcoming_project_deadlines: UpcomingProjectDeadline[];
    recent_activity: RecentActivity[];
  };
}

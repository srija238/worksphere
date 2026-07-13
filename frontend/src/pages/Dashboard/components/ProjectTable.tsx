import { Table } from '../../../components/Table';
import { formatDate } from '../../../utils/date';
import { DashboardIcon as Icon } from '../DashboardIcons';

export type ProjectSortField = 'name' | 'manager' | 'progress' | 'due_date';
export type ProjectSortDirection = 'asc' | 'desc';

interface ProjectTableProps<T> {
  projects: T[];
  getKey: (project: T, index: number) => string | number;
  getProjectName: (project: T) => string;
  getManagerName: (project: T) => string;
  getProgress: (project: T) => number;
  getDueDate: (project: T) => string | null | undefined;
  className?: string;
  sortField?: ProjectSortField;
  sortDirection?: ProjectSortDirection;
  onSort?: (field: ProjectSortField) => void;
}

const tableHeadClass = 'h-[37px] text-left text-[11.5px] font-normal text-[#ecf1f6]';
const tableCellClass = 'h-12 whitespace-nowrap border-t border-[#7e9eb41c] text-[11.5px] text-[#f5f7f9]';

function getAriaSort(
  field: ProjectSortField,
  activeField?: ProjectSortField,
  direction?: ProjectSortDirection,
) {
  if (field !== activeField) return 'none' as const;
  return direction === 'desc' ? 'descending' as const : 'ascending' as const;
}

function getSortIconName(isActive: boolean, direction?: ProjectSortDirection) {
  if (!isActive) return 'sort' as const;
  return direction === 'desc' ? 'arrow-down' as const : 'arrow-up' as const;
}

function getProgressColorClass(progress: number) {
  if (progress >= 100) return 'stroke-[#40bd72]';
  if (progress >= 80) return 'stroke-[#ffb413]';
  if (progress <= 25) return 'stroke-[#8e56d2]';
  return 'stroke-[#1684fb]';
}

export function ProjectTable<T>({
  projects,
  getKey,
  getProjectName,
  getManagerName,
  getProgress,
  getDueDate,
  className = '',
  sortField,
  sortDirection,
  onSort,
}: ProjectTableProps<T>) {
  function renderHeader(label: string, field: ProjectSortField) {
    if (!onSort) return label;

    const isActive = sortField === field;
    const directionLabel = isActive && sortDirection === 'desc' ? 'descending' : 'ascending';
    return <button
      type="button"
      onClick={() => onSort(field)}
      className={`group inline-flex h-full items-center gap-1.5 rounded-sm text-left transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff5a16] ${isActive ? 'font-semibold text-[#ff6a28]' : 'text-[#c5d0dc] hover:text-[#f5f7f9]'}`}
      aria-label={`Sort by ${label} ${isActive ? directionLabel : 'ascending'}`}
    >
      <span>{label}</span>
      <Icon
        name={getSortIconName(isActive, sortDirection)}
        className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-[#ff6a28]' : 'text-[#728496] opacity-70 group-hover:opacity-100'}`}
      />
    </button>;
  }

  return <Table className={`w-full min-w-[615px] table-fixed border-collapse ${className}`}>
    <thead><tr>
      <th scope="col" aria-sort={onSort ? getAriaSort('name', sortField, sortDirection) : undefined} className={`${tableHeadClass} w-[32%] pl-[21px]`}>{renderHeader('Project', 'name')}</th>
      <th scope="col" aria-sort={onSort ? getAriaSort('manager', sortField, sortDirection) : undefined} className={`${tableHeadClass} w-[21%]`}>{renderHeader('Manager', 'manager')}</th>
      <th scope="col" aria-sort={onSort ? getAriaSort('progress', sortField, sortDirection) : undefined} className={`${tableHeadClass} w-[24%]`}>{renderHeader('Progress', 'progress')}</th>
      <th scope="col" aria-sort={onSort ? getAriaSort('due_date', sortField, sortDirection) : undefined} className={`${tableHeadClass} w-[17%]`}>{renderHeader('Due Date', 'due_date')}</th>
      <th scope="col" className={`${tableHeadClass} w-[6%]`}><span className="sr-only">Actions</span></th>
    </tr></thead>
    <tbody>{projects.map((project, index) => {
      const projectName = getProjectName(project) || 'N/A';
      const progress = Math.max(0, Math.min(getProgress(project) ?? 0, 100));
      return <tr key={getKey(project, index)}>
        <td className={`${tableCellClass} pl-[21px]`}>{projectName}</td>
        <td className={tableCellClass}>{getManagerName(project) || 'N/A'}</td>
        <td className={tableCellClass}><div className="flex items-center gap-[11px]">
          <span className="w-[33px]">{progress}%</span>
          <svg className="h-1.5 w-[90px] overflow-visible rounded-full bg-[#5b778c2b]" viewBox="0 0 100 6" preserveAspectRatio="none" aria-hidden="true">
            <line className={getProgressColorClass(progress)} x1="0" y1="3" x2={progress} y2="3" strokeWidth="6" strokeLinecap="round"/>
          </svg>
        </div></td>
        <td className={tableCellClass}>{formatDate(getDueDate(project))}</td>
        <td className={tableCellClass}><button type="button" className="grid h-7 w-6 place-items-center border-0 bg-transparent p-0" aria-label={`Options for ${projectName}`}><Icon name="dots" className="h-[17px] w-[17px]"/></button></td>
      </tr>;
    })}</tbody>
  </Table>;
}

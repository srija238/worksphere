import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { EmptyState } from '../../../components/EmptyState';
import { DashboardIcon as Icon } from '../DashboardIcons';
import type { ProjectResponse } from '../types';
import { ProjectTable, type ProjectSortDirection, type ProjectSortField } from './ProjectTable';

const PAGE_SIZE = 10;

interface ProjectsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ProjectResponse[];
  triggerRef: RefObject<HTMLButtonElement | null>;
}

function getManagerName(project: ProjectResponse) {
  return project.manager_name ?? '';
}

function getProgress(project: ProjectResponse) {
  return project.progress ?? 0;
}

function normalizeSearchValue(value: string | null | undefined) {
  return value?.trim().toLocaleLowerCase() ?? '';
}

export function ProjectsDrawer({ isOpen, onClose, projects, triggerRef }: ProjectsDrawerProps) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<ProjectSortField>('name');
  const [sortDirection, setSortDirection] = useState<ProjectSortDirection>('asc');
  const [page, setPage] = useState(1);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !drawerRef.current) return;

      const focusableElements = Array.from(drawerRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ));
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) {
        event.preventDefault();
        drawerRef.current.focus();
      } else if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [isOpen, onClose, triggerRef]);

  useEffect(() => {
    setPage(1);
  }, [search, sortField, sortDirection]);

  const filteredProjects = useMemo(() => {
    const query = normalizeSearchValue(search);
    const filtered = projects.filter((project) => {
      if (!query) return true;

      const projectName = normalizeSearchValue(project.name);
      const managerName = normalizeSearchValue(getManagerName(project));
      return projectName.includes(query) || managerName.includes(query);
    });

    return [...filtered].sort((first, second) => {
      let firstValue: string | number;
      let secondValue: string | number;

      switch (sortField) {
        case 'manager':
          firstValue = getManagerName(first);
          secondValue = getManagerName(second);
          break;
        case 'progress':
          firstValue = getProgress(first);
          secondValue = getProgress(second);
          break;
        case 'due_date':
          firstValue = first.end_date ? new Date(first.end_date).getTime() : Number.MAX_SAFE_INTEGER;
          secondValue = second.end_date ? new Date(second.end_date).getTime() : Number.MAX_SAFE_INTEGER;
          break;
        default:
          firstValue = first.name ?? '';
          secondValue = second.name ?? '';
      }

      const comparison = typeof firstValue === 'number' && typeof secondValue === 'number'
        ? firstValue - secondValue
        : String(firstValue).localeCompare(String(secondValue));
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [projects, search, sortDirection, sortField]);

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const firstProjectIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleProjects = filteredProjects.slice(firstProjectIndex, firstProjectIndex + PAGE_SIZE);
  const rangeStart = filteredProjects.length === 0 ? 0 : firstProjectIndex + 1;
  const rangeEnd = Math.min(firstProjectIndex + PAGE_SIZE, filteredProjects.length);

  function handleSort(field: ProjectSortField) {
    if (field === sortField) {
      setSortDirection((direction) => direction === 'asc' ? 'desc' : 'asc');
      return;
    }

    setSortField(field);
    setSortDirection('asc');
  }

  return <div
    className={`fixed inset-0 z-[80] transition-[visibility] duration-300 ${isOpen ? 'visible' : 'invisible delay-300'}`}
    aria-hidden={!isOpen}
  >
    <div className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" onMouseDown={onClose}/>
    <div
      ref={drawerRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="projects-drawer-title"
      tabIndex={-1}
      className={`absolute inset-y-0 right-0 flex w-full flex-col border-l border-[#7e9eb429] bg-[#071724] shadow-2xl transition-transform duration-300 ease-out md:w-[85vw] lg:w-[75vw] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <header className="flex min-h-[72px] items-center justify-between border-b border-[#7e9eb429] px-5 md:px-7">
        <div>
          <h2 id="projects-drawer-title" className="m-0 text-xl font-semibold tracking-normal text-[#f6f8fb]">All Projects</h2>
          <p className="mt-1 text-xs text-[#aeb9c7]">{projects.length} total projects</p>
        </div>
        <button ref={closeButtonRef} type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-md border border-[#7e9eb429] bg-transparent text-[#dce3eb] transition-colors hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#ff5a16]" aria-label="Close all projects">
          <Icon name="close" className="h-5 w-5"/>
        </button>
      </header>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b border-[#7e9eb429] px-5 py-4 md:px-7">
          <label className="flex h-10 min-w-0 flex-1 items-center gap-3 rounded-md border border-[#7e9eb429] bg-[#04111c80] px-3 text-[#c5d0dc]">
            <Icon name="search" className="h-[18px] w-[18px] shrink-0"/>
            <span className="sr-only">Search projects</span>
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[#f5f7f9] outline-none placeholder:text-[#8f9caa]" placeholder="Search by project or manager" aria-label="Search projects by project or manager"/>
          </label>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 md:px-7">
          {visibleProjects.length > 0 ? <ProjectTable
            projects={visibleProjects}
            getKey={(project) => project.id}
            getProjectName={(project) => project.name}
            getManagerName={getManagerName}
            getProgress={getProgress}
            getDueDate={(project) => project.end_date}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          /> : <EmptyState message={search.trim() ? 'No projects match your search.' : 'No data available'} className="py-20"/>}
        </div>

        <footer className="flex flex-col gap-3 border-t border-[#7e9eb429] px-5 py-4 text-xs text-[#b5c0cc] sm:flex-row sm:items-center sm:justify-between md:px-7">
          <p>Showing {rangeStart}-{rangeEnd} of {filteredProjects.length} {search.trim() ? `matching projects (${projects.length} total)` : 'projects'}</p>
          <div className="flex items-center gap-3">
            <button type="button" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="h-9 rounded-md border border-[#7e9eb429] px-4 font-medium text-[#f3f6f9] disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button type="button" disabled={currentPage === totalPages || filteredProjects.length === 0} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} className="h-9 rounded-md border border-[#7e9eb429] px-4 font-medium text-[#f3f6f9] disabled:cursor-not-allowed disabled:opacity-40">Next</button>
          </div>
        </footer>
      </div>
    </div>
  </div>;
}

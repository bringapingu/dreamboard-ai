export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  tags: string[];
  due_date: string | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Column {
  id: TaskStatus;
  title: string;
}

export const COLUMNS: Column[] = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  high: 'bg-tag-high/20 text-tag-high',
  medium: 'bg-tag-medium/20 text-tag-medium',
  low: 'bg-tag-low/20 text-tag-low',
};

export const TAG_COLORS: Record<string, string> = {
  important: 'bg-tag-important/20 text-tag-important',
  visualization: 'bg-tag-visualization/20 text-tag-visualization',
  conceptualization: 'bg-tag-conceptualization/20 text-tag-conceptualization',
  finance: 'bg-tag-finance/20 text-tag-finance',
  budget: 'bg-tag-budget/20 text-tag-budget',
  'ui design': 'bg-tag-ui-design/20 text-tag-ui-design',
  design: 'bg-tag-ui-design/20 text-tag-ui-design',
  bug: 'bg-tag-important/20 text-tag-important',
  feature: 'bg-tag-conceptualization/20 text-tag-conceptualization',
  research: 'bg-tag-budget/20 text-tag-budget',
};

export function getTagColor(tag: string): string {
  const lower = tag.toLowerCase();
  return TAG_COLORS[lower] || 'bg-muted text-muted-foreground';
}

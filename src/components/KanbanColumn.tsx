import { Droppable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import { Task, TaskStatus } from '@/types/kanban';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onAddClick: (status: TaskStatus) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

const STATUS_DOT: Record<TaskStatus, string> = {
  backlog: 'bg-muted-foreground',
  todo: 'bg-tag-budget',
  in_progress: 'bg-tag-finance',
  done: 'bg-primary',
};

export function KanbanColumn({ id, title, tasks, onAddClick, onUpdateTask, onDeleteTask }: KanbanColumnProps) {
  return (
    <div className="flex flex-col min-w-[280px] w-[300px] flex-shrink-0">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${STATUS_DOT[id]}`} />
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">{tasks.length}</span>
        </div>
        <button
          onClick={() => onAddClick(id)}
          className="p-1 rounded-md hover:bg-accent transition-colors"
        >
          <Plus className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 rounded-xl p-2.5 min-h-[200px] transition-colors duration-200
              ${snapshot.isDraggingOver ? 'bg-primary/5 border border-primary/20' : 'kanban-column border border-transparent'}`}
          >
            {tasks
              .sort((a, b) => a.position - b.position)
              .map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} onUpdate={onUpdateTask} onDelete={onDeleteTask} />
              ))}
            {provided.placeholder}

            <button
              onClick={() => onAddClick(id)}
              className="w-full mt-1 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Add New
            </button>
          </div>
        )}
      </Droppable>
    </div>
  );
}

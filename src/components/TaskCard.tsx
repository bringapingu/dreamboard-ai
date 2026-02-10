import { Draggable } from '@hello-pangea/dnd';
import { Calendar, MoreHorizontal, Trash2, Edit2 } from 'lucide-react';
import { Task, PRIORITY_COLORS, getTagColor } from '@/types/kanban';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { EditTaskDialog } from './EditTaskDialog';

interface TaskCardProps {
  task: Task;
  index: number;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, index, onUpdate, onDelete }: TaskCardProps) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`rounded-lg p-3.5 mb-2.5 transition-all duration-150 cursor-grab active:cursor-grabbing border border-border/50 group
              ${snapshot.isDragging ? 'shadow-xl shadow-primary/10 scale-[1.02] border-primary/30' : ''}
              bg-kanban-card hover:bg-kanban-card-hover`}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-sm font-medium text-foreground leading-snug flex-1 pr-2">{task.title}</h4>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-accent">
                    <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover border-border">
                  <DropdownMenuItem onClick={() => setEditOpen(true)}>
                    <Edit2 className="h-3.5 w-3.5 mr-2" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-destructive focus:text-destructive">
                    <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {task.description && (
              <p className="text-xs text-muted-foreground mb-2.5 line-clamp-2">{task.description}</p>
            )}

            <div className="flex flex-wrap gap-1.5 mb-2.5">
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${PRIORITY_COLORS[task.priority]}`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
              {task.tags.map(tag => (
                <span key={tag} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getTagColor(tag)}`}>
                  {tag}
                </span>
              ))}
            </div>

            {task.due_date && (
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            )}
          </div>
        )}
      </Draggable>
      <EditTaskDialog open={editOpen} onOpenChange={setEditOpen} task={task} onUpdate={onUpdate} />
    </>
  );
}

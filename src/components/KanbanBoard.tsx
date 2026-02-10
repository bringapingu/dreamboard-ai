import { useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { MessageSquare, LogOut, Plus, LayoutDashboard } from 'lucide-react';
import { COLUMNS, TaskStatus, Task } from '@/types/kanban';
import { KanbanColumn } from './KanbanColumn';
import { AddTaskDialog } from './AddTaskDialog';
import { AIChatPanel } from './AIChatPanel';
import { useTasks } from '@/hooks/useTasks';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

export function KanbanBoard() {
  const { tasks, loading, addTask, updateTask, deleteTask, moveTask } = useTasks();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addDialogStatus, setAddDialogStatus] = useState<TaskStatus>('todo');
  const [chatOpen, setChatOpen] = useState(false);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    moveTask(draggableId, destination.droppableId as TaskStatus, destination.index);
  };

  const handleAddClick = (status: TaskStatus) => {
    setAddDialogStatus(status);
    setAddDialogOpen(true);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const getTasksForColumn = (status: TaskStatus) => tasks.filter(t => t.status === status);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="flex gap-5 overflow-x-auto pb-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="min-w-[280px] w-[300px]">
              <Skeleton className="h-8 w-32 mb-3" />
              <div className="space-y-3">
                <Skeleton className="h-28 w-full rounded-lg" />
                <Skeleton className="h-24 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-3 flex items-center justify-between bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <LayoutDashboard className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Kanban Board</h1>
            <p className="text-[11px] text-muted-foreground">Manage your tasks efficiently</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setChatOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
          >
            <MessageSquare className="h-4 w-4" /> AI Chat
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-accent transition-colors text-sm text-muted-foreground"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </header>

      {/* Board */}
      <main className="flex-1 p-6 overflow-x-auto">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-5 min-w-max">
            {COLUMNS.map(col => (
              <KanbanColumn
                key={col.id}
                id={col.id}
                title={col.title}
                tasks={getTasksForColumn(col.id)}
                onAddClick={handleAddClick}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
              />
            ))}
          </div>
        </DragDropContext>
      </main>

      <AddTaskDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        defaultStatus={addDialogStatus}
        onAdd={addTask}
      />

      <AIChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}

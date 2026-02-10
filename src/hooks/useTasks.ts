import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Task, TaskStatus, TaskPriority } from '@/types/kanban';
import { useToast } from '@/hooks/use-toast';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTasks = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('position', { ascending: true });

    if (error) {
      toast({ title: 'Error loading tasks', description: error.message, variant: 'destructive' });
    } else {
      setTasks((data as Task[]) || []);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const addTask = async (task: { title: string; description: string; status: TaskStatus; priority: TaskPriority; tags: string[]; due_date: string | null }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const columnTasks = tasks.filter(t => t.status === task.status);
    const maxPos = columnTasks.length > 0 ? Math.max(...columnTasks.map(t => t.position)) + 1 : 0;

    const { data, error } = await supabase
      .from('tasks')
      .insert({ ...task, user_id: user.id, position: maxPos })
      .select()
      .single();

    if (error) {
      toast({ title: 'Error adding task', description: error.message, variant: 'destructive' });
    } else if (data) {
      setTasks(prev => [...prev, data as Task]);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const { error } = await supabase.from('tasks').update(updates).eq('id', id);
    if (error) {
      toast({ title: 'Error updating task', description: error.message, variant: 'destructive' });
    } else {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    }
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error deleting task', description: error.message, variant: 'destructive' });
    } else {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  const moveTask = async (taskId: string, newStatus: TaskStatus, newPosition: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Optimistic update
    setTasks(prev => {
      const updated = prev.map(t => {
        if (t.id === taskId) return { ...t, status: newStatus, position: newPosition };
        return t;
      });
      return updated;
    });

    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus, position: newPosition })
      .eq('id', taskId);

    if (error) {
      toast({ title: 'Error moving task', description: error.message, variant: 'destructive' });
      fetchTasks(); // revert
    }
  };

  return { tasks, loading, addTask, updateTask, deleteTask, moveTask, refetch: fetchTasks };
}

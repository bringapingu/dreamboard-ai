import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaskStatus, TaskPriority } from '@/types/kanban';

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultStatus: TaskStatus;
  onAdd: (task: { title: string; description: string; status: TaskStatus; priority: TaskPriority; tags: string[]; due_date: string | null }) => void;
}

export function AddTaskDialog({ open, onOpenChange, defaultStatus, onAdd }: AddTaskDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [tags, setTags] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({
      title: title.trim(),
      description: description.trim(),
      status: defaultStatus,
      priority,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      due_date: dueDate || null,
    });
    setTitle(''); setDescription(''); setPriority('medium'); setTags(''); setDueDate('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Task title" value={title} onChange={e => setTitle(e.target.value)} className="bg-input border-border text-foreground" />
          <Textarea placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} className="bg-input border-border text-foreground resize-none" rows={3} />
          <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
            <SelectTrigger className="bg-input border-border text-foreground"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="low">Low Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
            </SelectContent>
          </Select>
          <Input placeholder="Tags (comma separated)" value={tags} onChange={e => setTags(e.target.value)} className="bg-input border-border text-foreground" />
          <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="bg-input border-border text-foreground" />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">Add Task</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

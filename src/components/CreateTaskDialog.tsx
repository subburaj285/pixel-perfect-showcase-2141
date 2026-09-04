import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSystem } from "@/lib/system-store";
import type { Severity, TaskStatus } from "@/lib/mock-data";

const TECHS = ["Unassigned", "R. Meena", "S. Kumar", "A. Patil", "D. Rao", "M. Singh"];

export function CreateTaskDialog({
  conveyorId,
  jointId,
  defaultTitle = "Inspect belt joint splice",
  defaultPriority = "critical",
  trigger,
}: {
  conveyorId: string;
  jointId: string;
  defaultTitle?: string;
  defaultPriority?: Severity;
  trigger: ReactNode;
}) {
  const { addTask } = useSystem();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(defaultTitle);
  const [priority, setPriority] = useState<Severity>(defaultPriority);
  const [status, setStatus] = useState<TaskStatus>("critical");
  const [technician, setTechnician] = useState("R. Meena");
  const [due, setDue] = useState("Within 24 hours");
  const [note, setNote] = useState("");

  function submit() {
    if (!title.trim()) {
      toast.error("Task title is required");
      return;
    }
    addTask({
      conveyorId,
      jointId,
      title: title.trim(),
      priority,
      due,
      status,
      technician,
      notes: note.trim() ? [note.trim()] : [],
    });
    toast.success(`Maintenance task created for ${conveyorId} / ${jointId}`);
    setOpen(false);
    setNote("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create maintenance task</DialogTitle>
          <DialogDescription>
            {conveyorId} · Joint {jointId}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="task-title">Task</Label>
            <Input id="task-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Severity)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Routine</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Queue</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="due-today">Due today</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="in-progress">In progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Technician</Label>
              <Select value={technician} onValueChange={setTechnician}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TECHS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="task-due">Due</Label>
              <Input id="task-due" value={due} onChange={(e) => setDue(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="task-note">Notes</Label>
            <Textarea
              id="task-note"
              rows={3}
              placeholder="Access, isolation and spares required…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>Create task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

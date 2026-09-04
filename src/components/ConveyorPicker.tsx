import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSystem } from "@/lib/system-store";

export function ConveyorPicker({ className }: { className?: string }) {
  const { conveyors, selectedConveyorId, selectConveyor } = useSystem();
  return (
    <Select value={selectedConveyorId} onValueChange={(v) => selectConveyor(v)}>
      <SelectTrigger className={className} aria-label="Select conveyor">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="max-h-80">
        {conveyors.map((c) => (
          <SelectItem key={c.id} value={c.id}>
            {c.id} – {c.route}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

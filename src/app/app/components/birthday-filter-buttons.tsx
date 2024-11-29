import { Button } from "@/components/ui/button";

export default function FilterButtons({
  filter,
  onFilterChange,
  disabled,
}: {
  filter: string;
  onFilterChange?: (value: "all" | "thisMonth") => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex gap-4 mb-6">
      <Button
        variant={filter === "all" ? "default" : "ghost"}
        onClick={() => onFilterChange?.("all")}
        size="sm"
        disabled={disabled}
      >
        Todos
      </Button>
      <Button
        variant={filter === "thisMonth" ? "default" : "ghost"}
        onClick={() => onFilterChange?.("thisMonth")}
        size="sm"
        disabled={disabled}
      >
        Este mês
      </Button>
    </div>
  );
}

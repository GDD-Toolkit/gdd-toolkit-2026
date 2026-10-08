import { Search } from "lucide-react";

type ToolSearchProps = {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  placeholder?: string;
};

export default function ToolSearch({
  value,
  onChange,
  onSearch,
  placeholder = "Search AI tools...",
}: ToolSearchProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSearch?.();
    }
  };

  return (
    <div className="w-full max-w-3xl flex items-center border border-gray-300 rounded-full px-4 py-2">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="min-w-0 flex-1 outline-none text-gray-600"
      />

      <button
        type="button"
        onClick={onSearch}
        className="shrink-0"
        aria-label="Search"
      >
        <Search size={20} />
      </button>
    </div>
  );
}

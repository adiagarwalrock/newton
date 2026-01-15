import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const SOURCE_OPTIONS = [
  { value: "all", label: "All Sources" },
  { value: "direct", label: "Direct", color: "bg-blue-500" },
  { value: "partner", label: "Partner", color: "bg-violet-500" },
  { value: "internal", label: "Internal", color: "bg-emerald-500" },
]

const SourceFilter = ({ value, onChange }) => (
  <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
    <span className="text-sm text-slate-500 whitespace-nowrap">Filter:</span>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[140px] border-0 shadow-none focus:ring-0 h-8 text-sm font-medium text-slate-700 bg-transparent">
        <SelectValue placeholder="All Sources" />
      </SelectTrigger>
      <SelectContent className="rounded-xl border-slate-200 shadow-lg">
        {SOURCE_OPTIONS.map(({ value, label, color }) => (
          <SelectItem key={value} value={value} className="rounded-lg text-sm">
            {color ? (
              <span className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${color}`} />
                {label}
              </span>
            ) : label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
)

export default SourceFilter

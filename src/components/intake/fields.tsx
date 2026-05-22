import { cn } from "@/lib/utils";

const inputBase =
  "w-full rounded border border-line bg-white px-3.5 py-2.5 text-[0.9rem] text-ink outline-none transition focus:border-accent focus:ring-[3px] focus:ring-accent/10";

export function FieldLabel({
  children,
  optional,
  required,
  htmlFor,
}: {
  children: React.ReactNode;
  optional?: string;
  required?: boolean;
  htmlFor?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="text-[0.8rem] font-semibold tracking-[0.02em] text-ink-2">
      {children}
      {required && <span className="ml-0.5 text-accent">*</span>}
      {optional && <span className="ml-1 font-normal text-ink-3">{optional}</span>}
    </label>
  );
}

export function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  optional,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  optional?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel htmlFor={id} required={required} optional={optional}>
        {label}
      </FieldLabel>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputBase}
      />
    </div>
  );
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = "Selecteer...",
  required,
  optional,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
  optional?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel htmlFor={id} required={required} optional={optional}>
        {label}
      </FieldLabel>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(inputBase, "cursor-pointer appearance-none bg-no-repeat pr-8")}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23666' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
          backgroundPosition: "right 12px center",
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
  optional,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  optional?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel htmlFor={id} required={required} optional={optional}>
        {label}
      </FieldLabel>
      <textarea
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(inputBase, "min-h-[80px] resize-y leading-relaxed")}
      />
    </div>
  );
}

export function RangeField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[0.85rem] font-semibold text-ink-2">{label}</span>
        <span className="min-w-[40px] text-right text-[1.1rem] font-semibold text-accent">
          {value}
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 cursor-pointer"
      />
      <div className="flex justify-between px-0.5 text-[0.7rem] text-ink-3">
        <span>laag</span>
        <span>hoog</span>
      </div>
    </div>
  );
}

export function CheckboxChip({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex select-none items-center gap-2 rounded border px-3 py-2 text-left text-[0.85rem] transition",
        checked
          ? "border-accent bg-accent-light font-medium text-accent"
          : "border-line bg-white text-ink-2 hover:border-accent hover:bg-accent-light",
      )}
    >
      <span
        className={cn(
          "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-[3px] border text-[10px] text-white transition",
          checked ? "border-accent bg-accent" : "border-line",
        )}
      >
        {checked ? "✓" : ""}
      </span>
      {label}
    </button>
  );
}

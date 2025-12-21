import React, { useState, KeyboardEvent } from "react";
import { Icon } from "@iconify/react";

interface SkillsTagInputProps {
  value: string[];
  onChange: (skills: string[]) => void;
  inputClassName?: string;
  placeholder?: string;
}

export const SkillsTagInput: React.FC<SkillsTagInputProps> = ({
  value,
  onChange,
  inputClassName = "",
  placeholder = "Ajouter une compétence",
}) => {
  const [inputValue, setInputValue] = useState("");

  const addSkill = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInputValue("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onChange(value.filter((skill) => skill !== skillToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {value.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1 px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="hover:text-destructive transition-colors"
            >
              <Icon icon={"mdi:close"} className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={inputClassName}
        />
        <button
          type="button"
          onClick={addSkill}
          className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
        >
          <Icon icon={"mdi:plus"} className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

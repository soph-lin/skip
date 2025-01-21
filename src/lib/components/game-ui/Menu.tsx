import { cn } from "@/lib/utils/misc";
import { useCallback, useEffect, useState } from "react";
import RightArrow from "@/assets/svg/RightArrow";

interface MenuProps {
  title: string;
  options: string[];
  onSelect?: (selected: string) => void;
}

export default function Menu({ title, options, onSelect }: MenuProps) {
  const [initialized, setInitialized] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cooldown, setCooldown] = useState(false);
  const length = options.length;

  const isSelected = (index: number) => selectedIndex === index;

  useEffect(() => {
    setInitialized(true);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (cooldown) return;
    if (e.key === "up" || e.key === "w") {
      setSelectedIndex((prev) => (prev - 1 + length) % length);
      setCooldown(true);
    } else if (e.key === "down" || e.key === "s") {
      setSelectedIndex((prev) => (prev + 1 + length) % length);
      setCooldown(true);
    } else if (e.key === " ") {
      onSelect?.(options[selectedIndex]);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!initialized) return;
    setTimeout(() => setCooldown(false), 300);
  }, [selectedIndex]);

  return (
    <div className="w-full h-full flex flex-col gap-3 text-foreground text-3xl">
      <h1 className="text-6xl m-8">{title}</h1>
      {options.map((option, index) => (
        <div
          key={index}
          className={
            "flex flex-row items-center gap-2 p-2 transition-all text-shadow-sm"
          }
        >
          <span
            className={cn(
              "size-8 transition-opacity",
              isSelected(index) ? "opacity-100" : "opacity-0"
            )}
          >
            <RightArrow />
          </span>
          <span>{option}</span>
        </div>
      ))}
    </div>
  );
}

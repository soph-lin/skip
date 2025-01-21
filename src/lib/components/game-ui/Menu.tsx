import { useCallback, useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils/misc";
import RightArrow from "@/assets/svg/RightArrow";

interface MenuProps {
  title: string;
  options: string[];
  onSelect?: (selected: string) => void;
}

export default function Menu({ title, options, onSelect }: MenuProps) {
  const selectedIndexRef = useRef(0);
  const cooldownRef = useRef(false);
  const [, forceRender] = useState({});

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Quit if cooling down
      if (cooldownRef.current) return;

      // Next index logic
      let nextIndex = selectedIndexRef.current;
      if (e.key === "ArrowUp" || e.key === "w") {
        nextIndex =
          (selectedIndexRef.current - 1 + options.length) % options.length;
        selectedIndexRef.current = nextIndex;
      } else if (e.key === "ArrowDown" || e.key === "s") {
        nextIndex = (selectedIndexRef.current + 1) % options.length;
        selectedIndexRef.current = nextIndex;
      } else if (e.key === " ") {
        onSelect?.(options[selectedIndexRef.current]);
      }

      forceRender({});

      // Activate cooldown
      if (
        e.key === "ArrowUp" ||
        e.key === "ArrowDown" ||
        e.key === "w" ||
        e.key === "s"
      ) {
        cooldownRef.current = true;
        setTimeout(() => (cooldownRef.current = false), 300);
      }
    },
    [onSelect, options, forceRender]
  );

  useEffect(() => {
    // Attach event listener to window
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      // Clean up event listener on unmount
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const isSelected = (index: number) => selectedIndexRef.current === index;

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

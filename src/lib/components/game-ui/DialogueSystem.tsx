"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "../../utils/misc";

import startDialogue from "@/lib/utils/dialogue/compiled/start.ink.json";
import bookDialogue from "@/lib/utils/dialogue/compiled/book.ink.json";
import guitarDialogue from "@/lib/utils/dialogue/compiled/guitar.ink.json";
import DialogueManager from "../../utils/dialogue/DialogueManager";
import { useGame } from "../game/GameProvider";

const reservedKeywords = ["SET", "IF", "ELSE IF"];

function startsWithReservedKeyword(line) {
  for (const keyword of reservedKeywords) {
    if (line.trim().startsWith(keyword)) return true;
  }
  return false;
}

const dialogues = {
  start: startDialogue,
  book: bookDialogue,
  guitar: guitarDialogue,
};

export default function DialogueSystem() {
  const initialized = useRef(false);
  const [dialogueManager, setDialogueManager] = useState(
    () => new DialogueManager(startDialogue)
  );
  const currentLine = useRef<string | null>(null);
  const [typedLine, setTypedLine] = useState<string>("");
  const [choices, setChoices] = useState<{ index: number; text: string }[]>([]);
  const typingInterval = useRef<NodeJS.Timeout | null>(null);
  const { setCompletedTutorial, setCurrentEnergy } = useGame();
  const completedTyping = typedLine === currentLine.current;

  // Initialize dialogue
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
    }
  }, []);

  // Update dialogue
  useEffect(() => {
    const handleUpdateDialogue = async (e: MessageEvent<{ name: string }>) => {
      // Dialogue in-progress, don't update to new dialogue
      if (currentLine.current) return;

      // Load new dialogue
      const name = e.data.name;
      if (name in dialogues) {
        const manager = new DialogueManager(dialogues[name]);
        setDialogueManager(manager);
        return;
      }

      // Load new dialogue dynamically. Currently only works locally.
      const modulePath = `@/lib/utils/dialogue/compiled/${name}.ink.json`;
      try {
        const dialogueData = await import(modulePath);
        const manager = new DialogueManager(dialogueData.default);
        setDialogueManager(manager);
      } catch (error) {
        console.error(`Failed to load dialogue file: ${modulePath}`, error);
      }
    };
    window.addEventListener(
      "setDialogue",
      handleUpdateDialogue as EventListener
    );
  }, []);

  useEffect(() => {
    advanceDialogue();
  }, [dialogueManager]);

  // Process dialogue
  const advanceDialogue = () => {
    const line = dialogueManager.getNextLine();
    const tags = dialogueManager.getTags();
    currentLine.current = line;
    setChoices(dialogueManager.getChoices());
    processEvents(tags); // Process directly, since useEffect doesn't capture change if it's a line with reserved keyword

    if (line) {
      if (startsWithReservedKeyword(line)) {
        advanceDialogue();
      } else typeOutText(line);
    } else {
      setTypedLine("");
    }
  };

  const handleChoiceClick = (index: number) => {
    dialogueManager.selectChoice(index);
    advanceDialogue();
  };

  const processEvents = (events: string[]) => {
    events.forEach((event) => {
      if (event === "completedTutorial") {
        setCompletedTutorial(true);
      } else if (event.startsWith("lowerEnergy-")) {
        const amount = parseInt(event.split("-")[1], 10);
        if (!isNaN(amount)) setCurrentEnergy((prev) => prev - amount);
      }
    });
  };

  useEffect(() => {
    return () => {
      if (typingInterval.current) {
        clearInterval(typingInterval.current);
      }
    };
  }, []);

  // Key bindings
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === " ") {
        event.preventDefault();
        if (currentLine.current && !completedTyping) {
          clearInterval(typingInterval.current);
          typingInterval.current = null;
          setTypedLine(currentLine.current);
        } else {
          advanceDialogue();
        }
      }
    },
    [advanceDialogue]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Typewriter effect
  const typeSpeed = 20; // in milliseconds
  const typeOutText = (text: string) => {
    if (typingInterval.current) {
      clearInterval(typingInterval.current);
    }

    let currentIndex = 0;
    setTypedLine("");

    typingInterval.current = setInterval(() => {
      if (currentIndex <= text.length) {
        setTypedLine(text.slice(0, currentIndex));
        currentIndex += 1;
      } else {
        if (typingInterval.current) {
          clearInterval(typingInterval.current);
        }
      }
    }, typeSpeed);
  };

  // Content
  return (
    <div
      className={cn(
        "w-full h-[100px] rounded-md border border-foreground shadow-lg bg-white flex flex-col gap-1 p-2 items-center text-lg select-none",
        currentLine.current ? "visible" : "invisible"
      )}
    >
      <p>{typedLine}</p>
      {completedTyping && (
        <div className="flex flex-row gap-4 items-center">
          {choices.map((choice) => (
            <button
              key={choice.index}
              onClick={() => handleChoiceClick(choice.index)}
            >
              {choice.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

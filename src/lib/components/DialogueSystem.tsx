"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "../utils/misc";

import startDialogue from "@/lib/utils/dialogue/compiled/start.ink.json";
import DialogueManager from "../utils/dialogue/DialogueManager";

export default function DialogueSystem() {
  const initialized = useRef(false);
  const [dialogueManager, setDialogueManager] = useState(
    () => new DialogueManager(startDialogue)
  );
  const [currentLine, setCurrentLine] = useState<string | null>(null);
  const [typedLine, setTypedLine] = useState<string>("");
  const [choices, setChoices] = useState<{ index: number; text: string }[]>([]);
  const [events, setEvents] = useState<string[]>([]);
  const typingInterval = useRef<NodeJS.Timeout | null>(null);

  // Initialize dialogue
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
    }
  }, []);

  // Update dialogue
  useEffect(() => {
    const handleUpdateDialogue = async (e: MessageEvent<{ name: string }>) => {
      const name = e.data.name;
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
    setCurrentLine(line);
    setChoices(dialogueManager.getChoices());
    setEvents(tags); // Capture custom tags

    if (line) typeOutText(line);
    else setTypedLine("");
  };

  const handleChoiceClick = (index: number) => {
    dialogueManager.selectChoice(index);
    advanceDialogue();
  };

  useEffect(() => {
    // Process custom events
    events.forEach((event) => {
      if (event.startsWith("event ")) {
        const eventName = event.split(" ")[1];
        console.log(`Triggered event: ${eventName}`);
      } else if (event.startsWith("trigger ")) {
        const triggerName = event.split(" ")[1];
        console.log(`Triggered custom function: ${triggerName}`);
      }
    });
  }, [events]);

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
        advanceDialogue();
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
        "w-full h-[100px] rounded-md border border-black bg-white flex flex-col gap-1 p-2 items-center text-lg select-none",
        currentLine ? "visible" : "invisible"
      )}
    >
      <p>{typedLine}</p>
      {typedLine === currentLine && (
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

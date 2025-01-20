/* eslint-disable @typescript-eslint/no-explicit-any */

import { Story } from "inkjs";

export default class DialogueManager {
  story: Story;

  constructor(inkJSON: Record<string, any>) {
    this.story = new Story(inkJSON);
  }

  // Get next line of dialogue
  getNextLine(): string | null {
    if (this.story.canContinue) {
      return this.story.Continue(); // Advance story
    }
    return null;
  }

  // Get choices from current dialogue point
  getChoices() {
    return this.story.currentChoices.map((choice) => ({
      index: choice.index,
      text: choice.text,
    }));
  }

  // Select choice by index
  selectChoice(index: number) {
    this.story.ChooseChoiceIndex(index);
  }

  // Process tags to trigger custom logic
  getTags(): string[] {
    return this.story.currentTags || [];
  }
}

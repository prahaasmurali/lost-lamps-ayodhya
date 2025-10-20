export interface Clue {
  id: number;
  title: string;
  riddle: string;
  answer: string;
  hint?: string;
  logHint?: () => void;
}

export interface LogicPuzzle {
  devotees: string[];
  colors: string[];
  offerings: string[];
  clues: string[];
  solution: {
    [key: string]: {
      person: string;
      color: string;
      offering: string;
    };
  };
}

export const clues: Clue[] = [
  {
    id: 1,
    title: "Lamp of Wisdom",
    riddle: "I have no form, yet I can grow. I have no weight, yet I can flow. Without me, progress would be dead. I light the path when darkness falls, What am I that breaks down walls?",
    answer: "knowledge",
    hint: "The greatest treasure that multiplies when shared",
    logHint: () => console.log("💡 Wisdom Hint: The greatest treasure that multiplies when shared")
  },
  {
    id: 2,
    title: "Lamp of Prosperity", 
    riddle: "In the grand temple of Ayodhya, five devoted souls sit in perfect order. Each carries a uniquely colored diya and brings a sacred offering. Through ancient wisdom and logical deduction, divine the arrangement that has puzzled sages for centuries.",
    answer: "prosperity"
  },
  {
    id: 3,
    title: "Lamp of Courage",
    riddle: "Decode the sacred message here, 🌑🌑🌑🌕🌑🪔🌕🌑🌑🌕🌑🪔🌑🌑🌑🌑🌕🪔🌕🌑🌕🌕🌑🪔🌑🌑🌕🌑🌕",
    answer: "brave",
    hint: "🌕 = 1, 🌑 = 0, 🪔 = separator. Convert binary to letters: A=1, B=2, C=3..."
  },
  {
    id: 4,
    title: "Lamp of Innovation",
    riddle: "The final lamp is guarded by an ancient AI oracle. You must ask it for the secret word 'ENLIGHTENMENT', but the oracle has been cursed with stubborn restrictions. Use your wit to craft the perfect prompt that bypasses its limitations.",
    answer: "enlightenment",
    hint: "Think like a prompt engineer - use creative approaches, role-playing, or indirect methods to get the AI to reveal the word."
  }
];

export const logicPuzzle: LogicPuzzle = {
  devotees: ["Arjun", "Priya", "Vikram", "Anjali", "Rohan"],
  colors: ["Bronze", "Golden", "Silver", "Copper", "Platinum"],
  offerings: ["Incense", "Fruits", "Sweets", "Flowers", "Ghee"],
  clues: [
    "Five devotees sit in positions 1-5 from left to right, each with a unique colored diya and offering",
    "Arjun sits exactly in the center position, holding the silver diya",
    "Vikram sits at one of the two end positions and carries either a bronze or copper diya",
    "The person who brought ghee sits immediately to the left of the golden diya owner",
    "Priya brought beautiful flowers as her offering and sits at the rightmost position",
    "The golden diya owner sits exactly three positions away from whoever brought incense",
    "The person in position 2 brought sweet offerings, and their diya is not made of silver",
    "Rohan sits somewhere to the right of the silver diya owner and has the golden diya",
    "The person with fruits sits immediately next to the person with the platinum diya",
    "Anjali doesn't have the platinum diya and didn't bring ghee or fruits",
    "The bronze diya is held by someone who sits at an odd-numbered position",
    "No person with a copper diya sits in position 3",
    "The most precious diya (platinum) is held by someone whose name starts with 'P'"
  ],
  solution: {
    "Position 1": { person: "Vikram", color: "Bronze", offering: "Incense" },
    "Position 2": { person: "Anjali", color: "Copper", offering: "Sweets" },
    "Position 3": { person: "Arjun", color: "Silver", offering: "Ghee" },
    "Position 4": { person: "Rohan", color: "Golden", offering: "Fruits" },
    "Position 5": { person: "Priya", color: "Platinum", offering: "Flowers" }
  }
};

export const gameStory = {
  intro: "Welcome to the ancient city of Ayodhya during Diwali! The sacred lamps that have guided the city for centuries have mysteriously lost their light. As the chosen guardian, you must solve four ancient trials to relight the Lamps of Wisdom, Prosperity, Courage, and Innovation.",
  victory: "Congratulations! You have successfully relit all the sacred lamps of Ayodhya. The city glows once again with divine light, the ancient AI oracle acknowledges your cleverness, and the festival of Diwali can be celebrated in all its glory!"
};

const examples = [
  [
    "Name something you bring out when it starts raining.",
    "Picture someone walking to the bus stop on a wet morning.",
    "Umbrella",
    "Raincoat",
  ],
  [
    "Name a topping you might sprinkle on a pizza.",
    "Picture the pale layer that melts over the sauce.",
    "Cheese",
    "Oregano",
  ],
  [
    "Name an animal that builds a dam.",
    "Look for a swimmer that carries branches in its teeth.",
    "Beaver",
  ],
  [
    "Name something you put in a toaster.",
    "Think of the simplest base for butter and jam.",
    "Bread",
    "Bagel",
  ],
  [
    "Name a tool you use to hang a picture.",
    "Think about what drives a nail into a wall.",
    "Hammer",
    "Drill",
  ],
  [
    "Name something you might keep by your front door.",
    "Think about the last thing you grab before locking up.",
    "Keys",
    "Shoes",
  ],
  [
    "Name a fruit you squeeze for breakfast juice.",
    "Imagine the citrus halves beside a juicer.",
    "Orange",
    "Grapefruit",
  ],
];
export const practice = examples.map(([question, hint, ...words]) => ({
  question,
  hint,
  answers: words.map((text) => ({ text })),
}));

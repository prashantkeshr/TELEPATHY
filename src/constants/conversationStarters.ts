/** Curated locally, per spec §23 ("Generate locally first. Optional AI
 * integration may be added later."). Keyed by interest where a starter is
 * specific to it; "general" starters apply regardless of interests. */
export const STARTERS_BY_INTEREST: Record<string, string[]> = {
  Technology: ["What's a piece of tech you couldn't live without?", "What's a technology you think is overrated right now?"],
  AI: ["What's the most useful way you've actually used AI so far?", "What's one job you don't think AI will ever fully replace?"],
  Programming: ["What was the first thing you ever built that actually worked?", "What's a bug that took way longer to fix than it should have?"],
  Science: ["What's a scientific fact that still surprises you?", "If you could ask a scientist from 200 years from now one question, what would it be?"],
  Books: ["What's a book you'd recommend to almost anyone?", "What are you reading right now?"],
  Movies: ["What's a movie you can rewatch endlessly?", "What's a film everyone loves that you just don't get?"],
  Music: ["What's a song that instantly changes your mood?", "What's an artist you think is underrated?"],
  Travel: ["What's the most memorable place you've ever been?", "Where's somewhere you'd move to for a year if you could?"],
  Photography: ["What do you usually end up photographing?", "Phone camera or a real camera — what's your pick?"],
  Art: ["What kind of art actually stops you in your tracks?", "Do you make anything yourself, or mostly appreciate it?"],
  History: ["What historical period would you time-travel to, just to observe?", "What's a piece of history you think doesn't get talked about enough?"],
  Philosophy: ["What's a belief you've changed your mind about?", "Is there a philosophical question you actually think about often?"],
  Fitness: ["What's your favorite way to move your body?", "Morning workout or evening workout person?"],
  Space: ["Would you actually go to space if you had the chance?", "What's the most interesting thing we know about space right now?"],
  Psychology: ["What's a habit you understand the psychology of but still can't break?", "What's something about how people think that fascinates you?"],
  Design: ["What's a piece of everyday design you think is genuinely great?", "What's a product with genuinely bad design that annoys you?"],
  Entrepreneurship: ["If you started something tomorrow, what would it be?", "What's a small business you think is doing everything right?"],
  Gaming: ["What game have you put the most hours into?", "What's a game you think more people should play?"],
  Career: ["What's something about your work almost nobody knows?", "If money didn't matter, what would you actually do all day?"],
  Culture: ["What's a tradition from where you're from that you'd want to keep alive?", "What's something from another culture you wish was more common where you live?"],
  Study: ["What's something you're currently trying to learn?", "What's the best way you've found to actually retain what you study?"],
  Languages: ["What language would you most like to learn next?", "What's the hardest part about learning a new language for you?"],
  Business: ["What's a business idea you think is obvious but nobody's doing?", "What's the best business decision you've seen someone make?"],
  Startups: ["What's a startup you're rooting for?", "What's an industry you think is overdue for a startup to shake it up?"],
  Engineering: ["What's something engineered really well that most people take for granted?", "What's a piece of infrastructure you think about more than most people?"],
  Education: ["What's something school never taught you that it probably should have?", "What's the best class you ever took, and why?"],
};

export const GENERAL_STARTERS = [
  "What's something you've learned recently?",
  "What's a topic you could talk about for hours?",
  "What would you build if you had unlimited resources?",
  "What's something you're curious about but haven't looked into yet?",
  "What's a small thing that made your week better?",
  "What's something you're proud of that most people wouldn't guess?",
];

function pickRandom<T>(items: T[], count: number): T[] {
  const pool = [...items];
  const picked: T[] = [];
  while (pool.length && picked.length < count) {
    const i = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(i, 1)[0]);
  }
  return picked;
}

export function pickConversationStarters(interests: string[], count = 3): string[] {
  const pool = [...GENERAL_STARTERS];
  for (const interest of interests) {
    const specific = STARTERS_BY_INTEREST[interest];
    if (specific) pool.push(...specific);
  }
  return pickRandom(pool, count);
}

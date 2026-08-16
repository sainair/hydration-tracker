export const STREAKSTATES = ["alive", "frozen", "dead"] as const;
export type streakState = typeof STREAKSTATES[number];
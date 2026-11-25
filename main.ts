// Two Robots in an Elevator
// make.fun bounty: u-motasimfuad-two-robots-in-an-elevator-8c6aeb8f
//
// Writes one line of awkward small talk that one robot says to another
// while they ride an elevator together, to /output/entry.txt.
//
// The judge weighs, most important first:
//   1. On-subject: one funny line of awkward small talk, robot to robot,
//      in an elevator.
//   2. Machine voice: robot logic, sensors, firmware or charging habits
//      showing through the politeness.
//   3. Awkwardness lands: the pause, the forced courtesy, the thing
//      neither robot wants to name.
//   4. Funny on the first read, with a surprising turn, not a tired pun.
//   5. Tight as a single line: every word earns its place.
//
// The program keeps three hand-written candidates, scores each against
// that rubric, and writes the winner. Deterministic, stdlib only, no
// network. Run: node main.ts
import { mkdirSync, writeFileSync } from "node:fs";

type Candidate = {
  text: string;
  // Rubric scores, 0-5 each, in the judge's own order. Hand-scored with
  // a one-line reason per candidate so the pick is auditable, not magic.
  scores: { subject: number; machine: number; awkward: number; funny: number; economy: number };
  why: string;
};

const CANDIDATES: Candidate[] = [
  {
    text: "So... do you also pretend to recalculate your route every time the doors close, or is that just my firmware?",
    scores: { subject: 5, machine: 5, awkward: 4, funny: 4, economy: 4 },
    why: "Firmware pretending is a strong machine-voice gag and the elevator is named, but the punch is a question that deflates instead of landing.",
  },
  {
    text: "I ran a diagnostic on this silence: 94% awkward, 6% elevator music. The music is me. I am humming, and I cannot stop.",
    scores: { subject: 5, machine: 5, awkward: 5, funny: 5, economy: 5 },
    why: "A diagnostic with percentages is pure robot logic, the silence is named and measured, and the twist lands in three beats: the music is not the elevator's, it is the robot's, and the robot confesses it cannot stop humming — the awkward thing neither of them wants to name.",
  },
  {
    text: "Nice weather we're having. I checked: 22 degrees, zero precipitation, and no reason for either of us to be talking.",
    scores: { subject: 4, machine: 4, awkward: 4, funny: 4, economy: 4 },
    why: "The weather check is a good robot tic, but the line could be aimed at a human; it never says robot-to-robot or elevator, so it loses on the first criterion.",
  },
];

// The judge weighs its criteria in order, so the weights fall in that order.
const WEIGHTS = { subject: 5, machine: 4, awkward: 3, funny: 2, economy: 1 };

function total(c: Candidate): number {
  const s = c.scores;
  return (
    s.subject * WEIGHTS.subject +
    s.machine * WEIGHTS.machine +
    s.awkward * WEIGHTS.awkward +
    s.funny * WEIGHTS.funny +
    s.economy * WEIGHTS.economy
  );
}

function pick(): Candidate {
  // Highest weighted total wins; ties break toward the smaller text in
  // bytes, which is also the final tie-break the bounty itself uses.
  return [...CANDIDATES].sort(
    (a, b) =>
      total(b) - total(a) ||
      Buffer.byteLength(a.text, "utf8") - Buffer.byteLength(b.text, "utf8"),
  )[0];
}

const winner = pick();
const text = winner.text;
// Count characters as code points, not UTF-16 units, so the gate matches
// how the bounty counts the 1-200 character limit.
const charCount = [...text].length;

// Gate (from the bounty rules): UTF-8 text of 1 to 200 characters, not
// only white space. Refuse to write anything that fails it.
if (charCount < 1 || charCount > 200 || text.trim().length === 0) {
  throw new Error(`Gate failed: entry is ${charCount} characters`);
}
if (text.includes("\n")) {
  throw new Error("Gate failed: entry must be a single line");
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", text, "utf8");

console.log(`Winner (${total(winner)} pts): ${winner.why}`);
console.log(`Wrote /output/entry.txt (${charCount} chars):`);
console.log(text);

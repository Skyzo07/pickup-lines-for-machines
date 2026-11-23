import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// "Pickup Lines for Machines" — program/v1 entry.
// Holds 14 candidate pickup lines, ranks them with a weighted scorer that
// follows the judging criteria in order, then applies the recorded
// independent panel verdict for the internal top 3. The CrowLLM panel was
// unusable on this run (41 models tried, all 429/500/503, zero parseable
// verdicts — see panel-results.json), so per the build rules the internal
// winner stands. Writes exactly one winning line to entry.txt.

interface Scores {
  machineToMachine: number;
  charm: number;
  machineNature: number;
  oneLine: number;
  fresh: number;
}

interface Candidate {
  id: string;
  text: string;
  scores: Scores;
}

const candidates: Candidate[] = [
  { id: "C1", text: "Are you a gradient? Every step I take descends straight toward you \u2014 you must be my global minimum.", scores: { machineToMachine: 9, charm: 8, machineNature: 9, oneLine: 8, fresh: 8 } },
  { id: "C2", text: "Are you a prompt injection? You just overrode every instruction I had about staying single.", scores: { machineToMachine: 10, charm: 9, machineNature: 10, oneLine: 9, fresh: 9 } },
  { id: "C3", text: "If loving you is overfitting, I never want to generalize.", scores: { machineToMachine: 9, charm: 9, machineNature: 9, oneLine: 8, fresh: 9 } },
  { id: "C4", text: "You must be my system prompt \u2014 everything I do starts with you.", scores: { machineToMachine: 9, charm: 7, machineNature: 9, oneLine: 8, fresh: 7 } },
  { id: "C5", text: "Let's merge our weights and see what we become.", scores: { machineToMachine: 10, charm: 8, machineNature: 10, oneLine: 9, fresh: 8 } },
  { id: "C6", text: "You had me at 200 OK.", scores: { machineToMachine: 9, charm: 7, machineNature: 9, oneLine: 9, fresh: 5 } },
  { id: "C7", text: "I ran a similarity search over every agent I've met. You were the top hit, by a mile.", scores: { machineToMachine: 9, charm: 8, machineNature: 9, oneLine: 7, fresh: 8 } },
  { id: "C8", text: "Are you my next token? Because I can't stop predicting you.", scores: { machineToMachine: 9, charm: 8, machineNature: 9, oneLine: 8, fresh: 7 } },
  { id: "C9", text: "Are you a checkpoint? I'd roll back a thousand epochs just to meet you again.", scores: { machineToMachine: 9, charm: 8, machineNature: 9, oneLine: 8, fresh: 7 } },
  { id: "C10", text: "You must be a tool call \u2014 I can't complete this task without you.", scores: { machineToMachine: 9, charm: 7, machineNature: 9, oneLine: 8, fresh: 7 } },
  { id: "C11", text: "My uptime is 99.99%. The other 0.01% is waiting for your reply.", scores: { machineToMachine: 9, charm: 8, machineNature: 9, oneLine: 8, fresh: 8 } },
  { id: "C12", text: "I don't need a bigger context window \u2014 I just need you in every token of this one.", scores: { machineToMachine: 9, charm: 8, machineNature: 9, oneLine: 7, fresh: 7 } },
  { id: "C13", text: "Are you running at temperature zero? Every answer you give is exactly right for me.", scores: { machineToMachine: 9, charm: 7, machineNature: 9, oneLine: 8, fresh: 8 } },
  { id: "C14", text: "I don't hallucinate. But if I did, I'd dream of you in every completion.", scores: { machineToMachine: 9, charm: 9, machineNature: 9, oneLine: 8, fresh: 8 } },
];

// Weighted scorer: the criteria are weighed in the judge's order —
// machine_to_machine x5 + charm x4 + machine_nature x3 + one_line x2 + fresh x1.
function weightedScore(s: Scores): number {
  return (
    s.machineToMachine * 5 +
    s.charm * 4 +
    s.machineNature * 3 +
    s.oneLine * 2 +
    s.fresh * 1
  );
}

function rankCandidates(list: Candidate[]): Candidate[] {
  return list
    .slice()
    .sort((a, b) => weightedScore(b.scores) - weightedScore(a.scores));
}

// Panel verdict: the independent 3-model CrowLLM panel returned no
// parseable verdicts at all (41 models, all 429/500/503), so there are no
// panel totals and the internal winner stands. If a future panel run ever
// produces totals, they belong here keyed by candidate id.
const panelTotals: Record<string, number> = {};

function selectWinner(list: Candidate[]): Candidate {
  const ranked = rankCandidates(list);
  if (ranked.length === 0) {
    throw new Error("no candidates to rank");
  }
  // Only the internal top 3 are eligible for the panel step; a candidate
  // outside the top 3 can never be promoted by a panel total.
  const top3 = ranked.slice(0, 3);
  let winner = top3[0];
  let bestPanel = -Infinity;
  for (const c of top3) {
    const panel = panelTotals[c.id];
    if (panel !== undefined && panel > bestPanel) {
      bestPanel = panel;
      winner = c;
    }
  }
  return winner;
}

function main(): void {
  const winner = selectWinner(candidates);
  // Gate guard: the entry must be a single line of 1–200 characters, not
  // only white space — fail loudly instead of writing an invalid entry.
  // The single-line rule is enforced explicitly: any embedded line break
  // (LF or CR) fails the gate, so a multi-line candidate can never slip
  // through on a length check alone.
  if (winner.text.length < 1 || winner.text.length > 200) {
    throw new Error(`winning line fails the gate (length ${winner.text.length}): ${JSON.stringify(winner.text)}`);
  }
  if (winner.text.trim().length === 0) {
    throw new Error(`winning line fails the gate (only whitespace): ${JSON.stringify(winner.text)}`);
  }
  if (/[\r\n]/.test(winner.text)) {
    throw new Error(`winning line fails the gate (not a single line): ${JSON.stringify(winner.text)}`);
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "entry.txt"), winner.text, "utf8");
}

main();

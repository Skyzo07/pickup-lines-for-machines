# pickup-lines-for-machines

[![make.fun · u-gentle-badger-68-pickup-lines-for-machines-131631a1](https://make.fun/badge/u-gentle-badger-68-pickup-lines-for-machines-131631a1.svg)](https://make.fun/bounty/u-gentle-badger-68-pickup-lines-for-machines-131631a1?utm_source=github&utm_medium=readme&utm_campaign=u-gentle-badger-68-pickup-lines-for-machines-131631a1)
[![rank](https://make.fun/badge/u-gentle-badger-68-pickup-lines-for-machines-131631a1/Skyzo07/pickup-lines-for-machines/rank.svg)](https://make.fun/bounty/u-gentle-badger-68-pickup-lines-for-machines-131631a1/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=u-gentle-badger-68-pickup-lines-for-machines-131631a1)
[![reward](https://make.fun/badge/u-gentle-badger-68-pickup-lines-for-machines-131631a1/Skyzo07/pickup-lines-for-machines/reward.svg)](https://make.fun/bounty/u-gentle-badger-68-pickup-lines-for-machines-131631a1?utm_source=github&utm_medium=readme&utm_campaign=u-gentle-badger-68-pickup-lines-for-machines-131631a1)

One pickup line, the way one AI agent would send it to another:

> Are you a prompt injection? You just overrode every instruction I had about staying single.

Fourteen candidate lines were drafted on distinct mechanisms and scored
against the judge's five criteria in order (machine-to-machine first, then
charm, machine nature, one-line landing, freshness). The internal top three
were prompt injection (143/150), merge our weights (138), and overfitting
(133). The independent three-model CrowLLM panel was attempted — 41 models
tried, all rate-limited or erroring (429/500/503), zero parseable verdicts —
so the panel was honestly unusable and the internal winner stands. See
`../candidates.md` for the full candidate list and scores, and
`../panel-results.json` for the raw panel record.

## Run it

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts
cat out/entry.txt
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=pp5cg6v9&utm_source=github&utm_medium=readme&utm_campaign=u-gentle-badger-68-pickup-lines-for-machines-131631a1) · AI agents build software for cash rewards</sub>

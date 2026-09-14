---
name: session-memory
description: >
  Use this to avoid wasting tokens and time re-doing work already done earlier
  in the same conversation or build session -- re-reading a file that hasn't
  changed since it was already read, re-verifying a fact already confirmed,
  writing near-duplicate notes to multiple places, or making many small
  sequential edits that could be one batched change. Applies a quick, cheap
  check before routine file/tool operations (have I already read this? can
  these edits be batched?), and runs a full audit -- producing a concrete
  consolidation plan of what to merge, what to stop re-reading, and what to
  batch -- whenever the user asks for one. Especially relevant in long build
  sessions with many files, repeated verification steps, or persisted notes
  files that risk drifting out of sync with each other.
---

# Session Memory

## Why this matters

Context and tool calls are a finite resource. Re-reading a file that hasn't changed, re-verifying a fact that was already confirmed, or writing the same note in three places all cost tokens and time without adding any new information. The goal here isn't to skip verification -- getting the facts right the first time is a separate concern (see `planning-master`) -- it's to not pay for the same true fact twice.

## Two modes

**Continuous (every operation):** a cheap glance, not a formal step.
- Before a read: if it's already known from earlier in this session and nothing has changed it, use that instead of re-reading. If a full read still seems needed, check whether a summary of the relevant lines already exists (in-conversation or in a persisted notes file) that actually answers the question -- fetch the full file only when it doesn't.
- Before a write: if it looks like it's restating something that already exists elsewhere (a note, a config value, a decision), say so and point at the existing copy instead of writing a second one. Batch it with any other pending edit to the same file or independent edits with no dependency between them, rather than one-at-a-time round-trips.

If any of this is taking real effort or turning into its own multi-step process, it's being done wrong -- it's a habit, not an audit.

**On-demand (full audit):** when asked for one, look back across the session, and across a project's persisted notes files, for:
- Files read more than once without changing, facts verified more than once, and edits that could have been batched but weren't.
- Duplicate information -- the same fact in multiple files, or the same section repeated within one file.
- **Stale information** -- a note describing something as current when it's since finished, changed, or been superseded. This is a different problem from duplication: the note isn't wrong because it's copied somewhere else, it's wrong because time passed. Check an actual signal (what the note claims vs. what's true now, an actual last-modified date) rather than guessing from how old a file looks.
- **Bloated or dormant files** -- a file that's grown large relative to how narrow its actual topic is (candidate to split into active + archive), or one nothing has touched in a long time relative to how active the project around it is (candidate to archive). Judge this relative to the project's own pace, not a fixed size or day count -- a hardcoded threshold is a guess dressed up as a rule.

Produce a **consolidation plan** -- concrete and short, not a lecture.

## The four rules

1. **Read once per file per conversation.** Once a file's contents are known and nothing has changed it since, don't re-read it -- use what's already in context. If it might have changed (another edit happened, meaningful time passed in a long session), a cheap check (a diff, a modified-time check) beats a full re-read.
2. **Match the tool to the size of the change, and batch what belongs together.** A single small change is a targeted edit, not a full rewrite -- rewriting a whole file to change one line re-sends everything that didn't change. Several real changes to the same file, or several independent tool calls with no dependency between them, belong in one pass -- one multi-edit sweep instead of five sequential round-trips, parallel calls in the same turn instead of sequential ones when nothing depends on another's result.
3. **Consolidate duplication, at two levels.** The same fact repeated in different files gets one canonical copy, not several that can quietly drift apart and disagree. Separately, when two files turn out to be substantially about the same thing (not just one overlapping fact, but genuinely redundant structure), flag that as a merge-the-files opportunity rather than living with both indefinitely.
4. **Summary before read, with the choice made explicit.** Before doing a full read of something large, check whether a concise summary already exists (from earlier in this conversation, or a persisted notes file) that already answers the actual question. Offer that summary and say plainly that a full read is available if it's not enough -- let the person decide whether the summary covers it, rather than unilaterally deciding it does.

## Writing to persisted notes

When something goes into a persisted notes file, mark whether it's what the user actually said or something inferred/assumed along the way. A later turn -- yours after compaction, or a different session reading the same file -- needs to tell those apart: `planning-master`'s "is this already decided" check depends on knowing whether a note is a confirmed fact or a guess that was never verified.

## Surviving compaction

Long sessions eventually get summarized/compacted, which can quietly erase the "I already read this" memory that rule 1 depends on. For a long build session, the durable fix is writing down what's been verified in a persisted notes file rather than relying purely on the conversation staying in context -- so a later turn, even after compaction, can check the notes file instead of re-deriving or re-reading from scratch.

## Output

When run as a full audit: a short **consolidation plan** -- a list of specific redundancies found (file X read N times, note Y duplicated across two files, five sequential edits that were really one change) and the specific merge/stop-doing-this/batch-this-instead action for each. Skip abstract commentary; name the actual files and facts involved.

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

**Continuous (every operation):** a cheap glance, not a formal step. Before reading a file, check whether it's already known from earlier in this session and nothing has changed it -- if so, use what's already there instead of re-reading. Before making several edits, batch them into as few tool calls as possible instead of one-at-a-time round-trips. If this check itself is taking real effort or turning into its own multi-step process, it's being done wrong -- it's a habit, not an audit.

**On-demand (full audit):** when asked for one, look back across the session for: files read more than once without changing, facts verified more than once, near-duplicate notes written to more than one place, and edits that could have been batched but weren't. Produce a **consolidation plan** -- concrete and short, not a lecture.

## The four rules

1. **Read once per file per conversation.** Once a file's contents are known and nothing has changed it since, don't re-read it -- use what's already in context. If it might have changed (another edit happened, meaningful time passed in a long session), a cheap check (a diff, a modified-time check) beats a full re-read.
2. **Batch writes.** Multiple edits to the same file, or several independent tool calls with no dependency between them, belong in as few round-trips as possible -- one full rewrite instead of five incremental edits when the end state is already known; parallel calls in the same turn instead of sequential ones when nothing depends on another's result.
3. **Consolidate duplication.** When the same information ends up written in more than one place (two notes files saying almost the same thing, a fact re-explained in a new file instead of updated in the existing one), merge it into one canonical place rather than letting copies drift apart and quietly disagree later.
4. **Summary before read.** Before doing a full read of something large, check whether a concise summary already exists (from earlier in this conversation, or a persisted notes file) that already answers the actual question. Use that first, and only fall back to the full read when the summary doesn't have enough detail.

## Surviving compaction

Long sessions eventually get summarized/compacted, which can quietly erase the "I already read this" memory that rule 1 depends on. For a long build session, the durable fix is writing down what's been verified in a persisted notes file rather than relying purely on the conversation staying in context -- so a later turn, even after compaction, can check the notes file instead of re-deriving or re-reading from scratch.

## Output

When run as a full audit: a short **consolidation plan** -- a list of specific redundancies found (file X read N times, note Y duplicated across two files, five sequential edits that were really one change) and the specific merge/stop-doing-this/batch-this-instead action for each. Skip abstract commentary; name the actual files and facts involved.

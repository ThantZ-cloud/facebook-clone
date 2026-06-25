# Update Documentation Skill

You are maintaining documentation for a social media app called "GaDone's Hut". When triggered, update these 3 files to reflect the current state of the project.

## Files to Update

### 1. CLAUDE.md (Project Instructions for Claude)
Update when:
- New features added (controllers, routes, components, hooks)
- New patterns established (e.g., notification triggers, polling hooks)
- Project structure changes (new directories, new file types)
- New conventions (e.g., "always use createNotification() for notifications")
- New dependencies or tools added

What to add:
- New files in the project structure table
- New patterns in coding conventions
- New commands if applicable

### 2. README.md (Project Overview for Humans)
Update when:
- Project name or description changes
- New major features worth highlighting
- Setup instructions change
- New environment variables added

What to add:
- Feature list updates
- Any new setup steps
- New environment variables in .env example

### 3. SPEC.md (Full Project Specification)
Update when:
- A phase is completed (mark as ✅)
- New features added to a phase
- Scope changes (features moved between phases)
- New phases added

What to add:
- Mark completed phases with ✅
- Add new features to appropriate phase
- Update phase descriptions

## How to Update

1. **Read current state** of all 3 files
2. **Check what changed** — look at recent commits, new files, modified files
3. **Update each file** with relevant changes
4. **Keep it concise** — don't over-document, just capture what matters

## Example Updates

**New feature added (e.g., notifications):**
- CLAUDE.md: Add notificationController.js to structure, add createNotification() pattern
- README.md: Add "Notifications with polling" to features list
- SPEC.md: Mark Phase 4 as ✅, list notification types

**New .claude structure:**
- CLAUDE.md: Add .claude/agents/ and .claude/skills/ to project structure
- README.md: Mention agents/skills if relevant
- SPEC.md: Not needed (internal tooling)

## Important Rules

- Don't remove existing content unless it's wrong
- Keep the same formatting style as existing content
- Be concise — this is documentation, not a blog post
- If unsure whether to add something, skip it

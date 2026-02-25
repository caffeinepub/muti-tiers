# Specification

## Summary
**Goal:** Fix the Remove Player functionality so that players can be successfully removed from the rankings by an admin.

**Planned changes:**
- Add a `removePlayer(uuid: Text)` update method to the backend Motoko actor (`backend/main.mo`) that removes the matching player from all category stable storage arrays with no authorization checks
- Add a `useRemovePlayer` mutation hook in `frontend/src/hooks/useQueries.ts` that calls the backend `removePlayer` method and invalidates relevant React Query cache keys on success
- Fix the Remove Player flow in `frontend/src/components/AdminControls.tsx` to skip the PasscodeModal when the session is already unlocked (via sessionStorage), show it when not yet unlocked, and call the `useRemovePlayer` mutation with the target player's UUID upon confirmation

**User-visible outcome:** Admins can remove a player from the rankings table; if already authenticated this session the PasscodeModal is not shown again, and the player disappears from the table immediately after removal.

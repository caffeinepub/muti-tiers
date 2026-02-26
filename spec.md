# Specification

## Summary
**Goal:** Fix the Add Player and Remove Player flows end-to-end, and allow individual tier badge fields to be cleared/left empty when adding a player.

**Planned changes:**
- Make all 11 tier badge fields in `AddPlayerModal.tsx` optional and clearable; submit only non-empty tier values to the backend.
- Update the backend `addPlayer` method to skip storing tier badge entries with empty or whitespace-only labels.
- Audit and fix the full Add Player flow: correct argument shape in `useAddPlayer`, modal closes on success, inline error display, and React Query cache invalidation so the rankings table refreshes immediately.
- Audit and fix the full Remove Player flow: `removePlayer` backend method removes the player by UUID from all categories without authorization checks; `useRemovePlayer` calls it with the correct argument and invalidates cache.
- Fix `AdminControls.tsx` so that when the session is already unlocked, clicking Remove Player skips the PasscodeModal and goes directly to player selection/confirmation; if not unlocked, shows PasscodeModal first.

**User-visible outcome:** Admins can add players with only some tier badges filled in (leaving others blank), and both Add Player and Remove Player actions work correctly — persisting/removing data on the backend and immediately refreshing the rankings table without a page reload.

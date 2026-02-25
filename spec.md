# Specification

## Summary
**Goal:** Rename two existing categories throughout the application: "LTMs" → "Spear Mace" and "Pot" → "Diamond SMP Nethop Spear".

**Planned changes:**
- Update the category tab label, CategoryKey type, and all references from `ltms`/`LTMs` to `spearMace`/`Spear Mace` in the frontend (CategoryTabs.tsx, mockData.ts, AddPlayerModal.tsx, RankingsPage.tsx, TierBadge.tsx, useQueries.ts, and any other affected files).
- Update the category tab label, CategoryKey type, and all references from `pot`/`Pot` to `diamondSmpNethopSpear`/`Diamond SMP Nethop Spear` in the frontend (same files as above).
- Rename backend stable storage keys in `main.mo` from `ltms` to `spearMace` and from `pot` to `diamondSmpNethopSpear`, updating all query and update methods accordingly.
- Update `migration.mo` to migrate any existing data stored under the old keys (`ltms`, `pot`) to the new keys (`spearMace`, `diamondSmpNethopSpear`).

**User-visible outcome:** The category tabs previously labeled "LTMs" and "Pot" now display as "Spear Mace" and "Diamond SMP Nethop Spear" respectively, with all related UI labels, inputs, and backend storage consistently using the new names.

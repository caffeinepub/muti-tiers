import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserPlus, Loader2, AlertCircle } from 'lucide-react';
import { useAddPlayer } from '../hooks/useQueries';
import type { PlayerRanking } from '../backend';

interface AddPlayerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GAME_MODES = [
  { key: 'overall', label: 'Overall' },
  { key: 'spearMace', label: 'Spear Mace' },
  { key: 'vanilla', label: 'Vanilla' },
  { key: 'uhc', label: 'UHC' },
  { key: 'diamondSmpNethopSpear', label: 'Diamond SMP Nethop Spear' },
  { key: 'nethop', label: 'NethOP' },
  { key: 'smp', label: 'SMP' },
  { key: 'sword', label: 'Sword' },
  { key: 'axe', label: 'Axe' },
  { key: 'mace', label: 'Mace' },
];

const TIER_OPTIONS = ['HT1', 'HT2', 'HT3', 'HT4', 'HT5', 'LT1', 'LT2', 'LT3', 'LT4', 'LT5'];

const TIER_COLORS: Record<string, string> = {
  HT1: '#fbbf24',
  HT2: '#f97316',
  HT3: '#ef4444',
  HT4: '#a855f7',
  HT5: '#6366f1',
  LT1: '#22c55e',
  LT2: '#14b8a6',
  LT3: '#3b82f6',
  LT4: '#8b5cf6',
  LT5: '#ec4899',
};

const emptyForm = {
  username: '',
  uuid: '',
  region: 'NA',
  points: '',
  title: '',
  tiers: Object.fromEntries(GAME_MODES.map((m) => [m.key, ''])) as Record<string, string>,
};

export default function AddPlayerModal({ open, onOpenChange }: AddPlayerModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const addPlayerMutation = useAddPlayer();

  const handleClose = () => {
    if (addPlayerMutation.isPending) return;
    setForm(emptyForm);
    setError(null);
    onOpenChange(false);
  };

  const handleFieldChange = (field: keyof typeof emptyForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleTierChange = (modeKey: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      tiers: { ...prev.tiers, [modeKey]: value },
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.username.trim()) {
      setError('Username is required.');
      return;
    }
    if (!form.uuid.trim()) {
      setError('UUID is required.');
      return;
    }
    if (!form.region) {
      setError('Region is required.');
      return;
    }

    const pointsNum = parseInt(form.points, 10);
    if (form.points !== '' && isNaN(pointsNum)) {
      setError('Points must be a valid number.');
      return;
    }

    const badges = GAME_MODES
      .filter((m) => form.tiers[m.key].trim() !== '')
      .map((m) => ({ category: m.key, tier: form.tiers[m.key].trim() }));

    const player: PlayerRanking = {
      username: form.username.trim(),
      uuid: form.uuid.trim(),
      region: form.region,
      points: BigInt(isNaN(pointsNum) ? 0 : pointsNum),
      title: form.title.trim(),
      rankPosition: BigInt(0),
      badges,
    };

    try {
      await addPlayerMutation.mutateAsync(player);
      setForm(emptyForm);
      setError(null);
      onOpenChange(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add player. Please try again.';
      setError(msg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto bg-mc-card border border-mc-border text-mc-text"
        style={{ scrollbarWidth: 'thin' }}
      >
        <DialogHeader>
          <DialogTitle
            className="flex items-center gap-2 text-mc-gold"
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.7rem' }}
          >
            <UserPlus className="w-4 h-4" />
            Add Player
          </DialogTitle>
          <DialogDescription className="text-mc-muted text-xs">
            Fill in the player details below. Tier fields are optional — leave blank to omit.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-1">
          {/* Core Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ap-username" className="text-mc-muted text-xs uppercase tracking-wider">
                Username <span className="text-red-400">*</span>
              </Label>
              <Input
                id="ap-username"
                value={form.username}
                onChange={(e) => handleFieldChange('username', e.target.value)}
                placeholder="e.g. Notch"
                className="bg-mc-bg border-mc-border text-mc-text placeholder:text-mc-muted focus-visible:ring-mc-gold"
                autoComplete="off"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ap-uuid" className="text-mc-muted text-xs uppercase tracking-wider">
                UUID <span className="text-red-400">*</span>
              </Label>
              <Input
                id="ap-uuid"
                value={form.uuid}
                onChange={(e) => handleFieldChange('uuid', e.target.value)}
                placeholder="e.g. 069a79f4-44e9-4726-a5be-fca90e38aaf5"
                className="bg-mc-bg border-mc-border text-mc-text placeholder:text-mc-muted focus-visible:ring-mc-gold font-mono text-xs"
                autoComplete="off"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ap-region" className="text-mc-muted text-xs uppercase tracking-wider">
                Region <span className="text-red-400">*</span>
              </Label>
              <Select value={form.region} onValueChange={(v) => handleFieldChange('region', v)}>
                <SelectTrigger
                  id="ap-region"
                  className="bg-mc-bg border-mc-border text-mc-text focus:ring-mc-gold"
                >
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent className="bg-mc-card border-mc-border text-mc-text">
                  <SelectItem value="NA" className="focus:bg-mc-hover focus:text-mc-text">NA — North America</SelectItem>
                  <SelectItem value="EU" className="focus:bg-mc-hover focus:text-mc-text">EU — Europe</SelectItem>
                  <SelectItem value="AS" className="focus:bg-mc-hover focus:text-mc-text">AS — Asia</SelectItem>
                  <SelectItem value="SA" className="focus:bg-mc-hover focus:text-mc-text">SA — South America</SelectItem>
                  <SelectItem value="OC" className="focus:bg-mc-hover focus:text-mc-text">OC — Oceania</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ap-points" className="text-mc-muted text-xs uppercase tracking-wider">
                Points
              </Label>
              <Input
                id="ap-points"
                type="number"
                min="0"
                value={form.points}
                onChange={(e) => handleFieldChange('points', e.target.value)}
                placeholder="e.g. 1500"
                className="bg-mc-bg border-mc-border text-mc-text placeholder:text-mc-muted focus-visible:ring-mc-gold"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="ap-title" className="text-mc-muted text-xs uppercase tracking-wider">
                Title
              </Label>
              <Input
                id="ap-title"
                value={form.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder="e.g. The Legend"
                className="bg-mc-bg border-mc-border text-mc-text placeholder:text-mc-muted focus-visible:ring-mc-gold"
                autoComplete="off"
              />
            </div>
          </div>

          {/* Tier Badges Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-mc-border" />
              <span
                className="text-mc-gold text-xs uppercase tracking-widest px-2"
                style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.55rem' }}
              >
                Tier Badges
              </span>
              <div className="h-px flex-1 bg-mc-border" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {GAME_MODES.map((mode) => (
                <div key={mode.key} className="space-y-1.5">
                  <Label
                    htmlFor={`ap-tier-${mode.key}`}
                    className="text-mc-muted text-xs uppercase tracking-wider block"
                  >
                    {mode.label}
                  </Label>
                  <Select
                    value={form.tiers[mode.key]}
                    onValueChange={(v) => handleTierChange(mode.key, v === '__none__' ? '' : v)}
                  >
                    <SelectTrigger
                      id={`ap-tier-${mode.key}`}
                      className="bg-mc-bg border-mc-border text-mc-text focus:ring-mc-gold h-8 text-xs"
                      style={
                        form.tiers[mode.key]
                          ? { color: TIER_COLORS[form.tiers[mode.key]] || undefined }
                          : undefined
                      }
                    >
                      <SelectValue placeholder="—" />
                    </SelectTrigger>
                    <SelectContent className="bg-mc-card border-mc-border text-mc-text">
                      <SelectItem value="__none__" className="focus:bg-mc-hover focus:text-mc-text text-mc-muted">
                        — None —
                      </SelectItem>
                      {TIER_OPTIONS.map((tier) => (
                        <SelectItem
                          key={tier}
                          value={tier}
                          className="focus:bg-mc-hover focus:text-mc-text font-bold text-xs"
                          style={{ color: TIER_COLORS[tier] }}
                        >
                          {tier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/30 rounded px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {error}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={addPlayerMutation.isPending}
              className="text-mc-muted hover:text-mc-text hover:bg-mc-hover"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={addPlayerMutation.isPending}
              className="bg-mc-gold text-mc-bg hover:bg-mc-gold/80 font-bold gap-2"
            >
              {addPlayerMutation.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  Add Player
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

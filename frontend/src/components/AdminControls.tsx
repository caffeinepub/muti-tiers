import React, { useState } from 'react';
import PasscodeModal from './PasscodeModal';
import AddPlayerModal from './AddPlayerModal';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { UserPlus, UserMinus, ShieldCheck, Loader2, Trash2 } from 'lucide-react';
import { useGetAllPlayers, useRemovePlayer } from '../hooks/useQueries';
import type { CategoryKey } from '../data/mockData';

const ADMIN_SESSION_KEY = 'muti_admin_unlocked';

function getSessionUnlocked(): boolean {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  } catch {
    return false;
  }
}

function setSessionUnlocked(value: boolean): void {
  try {
    if (value) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
    } else {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    }
  } catch {
    // ignore
  }
}

interface AdminControlsProps {
  activeCategory?: CategoryKey;
}

export default function AdminControls({ activeCategory = 'overall' }: AdminControlsProps) {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => getSessionUnlocked());
  const [passcodeModalOpen, setPasscodeModalOpen] = useState(false);
  const [addPlayerModalOpen, setAddPlayerModalOpen] = useState(false);
  const [removePlayerModalOpen, setRemovePlayerModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'add' | 'remove' | null>(null);
  const [selectedUuid, setSelectedUuid] = useState<string>('');
  const [confirmUuid, setConfirmUuid] = useState<string | null>(null);

  const { data: allPlayers = [] } = useGetAllPlayers();
  const removePlayerMutation = useRemovePlayer();

  const unlock = () => {
    setIsUnlocked(true);
    setSessionUnlocked(true);
  };

  const handleActionClick = (action: 'add' | 'remove') => {
    if (isUnlocked) {
      if (action === 'add') {
        setAddPlayerModalOpen(true);
      } else {
        setSelectedUuid('');
        setConfirmUuid(null);
        setRemovePlayerModalOpen(true);
      }
    } else {
      setPendingAction(action);
      setPasscodeModalOpen(true);
    }
  };

  const handlePasscodeSuccess = () => {
    unlock();
    setPasscodeModalOpen(false);
    const action = pendingAction;
    setPendingAction(null);
    if (action === 'add') {
      setAddPlayerModalOpen(true);
    } else if (action === 'remove') {
      setSelectedUuid('');
      setConfirmUuid(null);
      setRemovePlayerModalOpen(true);
    }
  };

  const handlePasscodeModalClose = () => {
    setPasscodeModalOpen(false);
    setPendingAction(null);
  };

  const handleRemovePlayerClose = () => {
    setRemovePlayerModalOpen(false);
    setSelectedUuid('');
    setConfirmUuid(null);
  };

  const handleRemoveConfirm = async () => {
    if (!selectedUuid) return;
    await removePlayerMutation.mutateAsync(selectedUuid);
    handleRemovePlayerClose();
  };

  // Deduplicate players by UUID for the list
  const uniquePlayers = React.useMemo(() => {
    const seen = new Set<string>();
    return allPlayers.filter((p) => {
      if (seen.has(p.uuid)) return false;
      seen.add(p.uuid);
      return true;
    });
  }, [allPlayers]);

  const selectedPlayer = uniquePlayers.find((p) => p.uuid === selectedUuid);

  return (
    <>
      <div className="flex items-center gap-2">
        {isUnlocked && (
          <span className="flex items-center gap-1 text-mc-gold text-xs px-2 py-1 rounded bg-mc-gold/10 border border-mc-gold/30">
            <ShieldCheck className="w-3 h-3" />
            Admin
          </span>
        )}
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleActionClick('add')}
          className="border-mc-border text-mc-muted hover:text-mc-text hover:bg-mc-hover hover:border-mc-gold/50 gap-1.5 text-xs"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Add Player
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleActionClick('remove')}
          className="border-mc-border text-mc-muted hover:text-mc-text hover:bg-mc-hover hover:border-red-500/50 gap-1.5 text-xs"
        >
          <UserMinus className="w-3.5 h-3.5" />
          Remove Player
        </Button>
      </div>

      <PasscodeModal
        open={passcodeModalOpen}
        onClose={handlePasscodeModalClose}
        onSuccess={handlePasscodeSuccess}
      />

      <AddPlayerModal
        open={addPlayerModalOpen}
        onOpenChange={setAddPlayerModalOpen}
        defaultCategory={activeCategory}
      />

      {/* Remove Player Modal */}
      <Dialog open={removePlayerModalOpen} onOpenChange={(open) => { if (!open) handleRemovePlayerClose(); }}>
        <DialogContent className="bg-mc-card border-mc-border text-mc-text max-w-md">
          <DialogHeader>
            <DialogTitle className="text-mc-text flex items-center gap-2">
              <UserMinus className="w-4 h-4 text-red-400" />
              Remove Player
            </DialogTitle>
            <DialogDescription className="text-mc-muted">
              Select a player to remove from all rankings.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            {uniquePlayers.length === 0 ? (
              <p className="text-mc-muted text-sm text-center py-4">No players found.</p>
            ) : (
              <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                {uniquePlayers.map((player) => (
                  <button
                    key={player.uuid}
                    onClick={() => setSelectedUuid(player.uuid)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded text-left transition-colors text-sm ${
                      selectedUuid === player.uuid
                        ? 'bg-red-500/20 border border-red-500/50 text-mc-text'
                        : 'bg-mc-bg border border-mc-border text-mc-muted hover:bg-mc-hover hover:text-mc-text'
                    }`}
                  >
                    <img
                      src={`https://crafatar.com/avatars/${player.uuid}?size=24&overlay`}
                      alt={player.username}
                      className="w-6 h-6 rounded pixelated flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://crafatar.com/avatars/8667ba71b85a4004af54457a9734eed7?size=24&overlay`;
                      }}
                    />
                    <span className="font-medium truncate">{player.username}</span>
                    <span className="ml-auto text-xs text-mc-muted truncate max-w-[80px]">{player.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedPlayer && confirmUuid !== selectedUuid && (
            <div className="bg-red-500/10 border border-red-500/30 rounded px-3 py-2 text-sm text-red-400">
              Remove <span className="font-bold text-mc-text">{selectedPlayer.username}</span> from all rankings?
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemovePlayerClose}
              className="border-mc-border text-mc-muted hover:text-mc-text hover:bg-mc-hover"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!selectedUuid || removePlayerMutation.isPending}
              onClick={handleRemoveConfirm}
              className="bg-red-600 hover:bg-red-700 text-white border-0 gap-1.5"
            >
              {removePlayerMutation.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Removing…
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

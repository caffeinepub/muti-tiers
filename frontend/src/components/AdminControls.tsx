import React, { useState } from 'react';
import PasscodeModal from './PasscodeModal';
import AddPlayerModal from './AddPlayerModal';
import { Button } from '@/components/ui/button';
import { UserPlus, UserMinus, ShieldCheck } from 'lucide-react';

interface AdminControlsProps {
  onRemovePlayer: () => void;
}

export default function AdminControls({ onRemovePlayer }: AdminControlsProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcodeModalOpen, setPasscodeModalOpen] = useState(false);
  const [addPlayerModalOpen, setAddPlayerModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'add' | 'remove' | null>(null);

  const handleActionClick = (action: 'add' | 'remove') => {
    if (isUnlocked) {
      if (action === 'add') {
        setAddPlayerModalOpen(true);
      } else {
        onRemovePlayer();
      }
    } else {
      setPendingAction(action);
      setPasscodeModalOpen(true);
    }
  };

  const handlePasscodeSuccess = () => {
    setIsUnlocked(true);
    setPasscodeModalOpen(false);
    if (pendingAction === 'add') {
      setAddPlayerModalOpen(true);
    } else if (pendingAction === 'remove') {
      onRemovePlayer();
    }
    setPendingAction(null);
  };

  const handlePasscodeModalClose = () => {
    setPasscodeModalOpen(false);
    setPendingAction(null);
  };

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
      />
    </>
  );
}

import React, { useState, useRef, useEffect } from 'react';
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
import { ShieldCheck, X } from 'lucide-react';

const CORRECT_PASSCODE = '65515616151';

interface PasscodeModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PasscodeModal({ open, onClose, onSuccess }: PasscodeModalProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setValue('');
      setError(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === CORRECT_PASSCODE) {
      setError(false);
      onSuccess();
    } else {
      setError(true);
      setValue('');
      inputRef.current?.focus();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="bg-mc-card border border-mc-border text-mc-text max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-mc-gold" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.75rem' }}>
            <ShieldCheck className="w-4 h-4" />
            Admin Access
          </DialogTitle>
          <DialogDescription className="text-mc-muted text-xs">
            Enter the admin passcode to manage players.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label htmlFor="passcode" className="text-mc-muted text-xs">Passcode</Label>
            <Input
              id="passcode"
              ref={inputRef}
              type="password"
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(false); }}
              placeholder="Enter passcode..."
              className={`bg-mc-bg border text-mc-text placeholder:text-mc-muted focus-visible:ring-mc-gold ${
                error ? 'border-red-500' : 'border-mc-border'
              }`}
              autoComplete="off"
            />
            {error && (
              <p className="text-red-400 text-xs flex items-center gap-1">
                <X className="w-3 h-3" /> Incorrect passcode. Try again.
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-mc-muted hover:text-mc-text hover:bg-mc-hover"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-mc-gold text-mc-bg hover:bg-mc-gold/80 font-bold"
            >
              Unlock
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

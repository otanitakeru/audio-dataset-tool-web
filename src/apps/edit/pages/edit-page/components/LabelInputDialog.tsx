import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

interface LabelInputDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
  initialValue?: string;
}

export const LabelInputDialog: React.FC<LabelInputDialogProps> = ({
  open,
  onClose,
  onConfirm,
  initialValue = "",
}) => {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setValue(initialValue);
      // ダイアログが開いたときにフォーカスを当てる
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open, initialValue]);

  const handleConfirm = () => {
    onConfirm(value);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleConfirm();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>ラベル名を入力</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="ラベル名"
          type="text"
          fullWidth
          variant="outlined"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          inputRef={inputRef}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button onClick={handleConfirm} variant="contained" color="primary">
          追加
        </Button>
      </DialogActions>
    </Dialog>
  );
};

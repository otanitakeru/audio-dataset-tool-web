import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

interface LabelEditDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
  onDelete: () => void;
  initialValue: string;
}

export const LabelEditDialog: React.FC<LabelEditDialogProps> = ({
  open,
  onClose,
  onConfirm,
  onDelete,
  initialValue,
}) => {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setValue(initialValue);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open, initialValue]);

  const handleConfirm = () => {
    onConfirm(value);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm("このラベルを削除してもよろしいですか？")) {
      onDelete();
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleConfirm();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>ラベルの編集</DialogTitle>
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
        <Button onClick={handleDelete} color="error" sx={{ mr: "auto" }}>
          削除
        </Button>
        <Button onClick={onClose}>キャンセル</Button>
        <Button onClick={handleConfirm} variant="contained" color="primary">
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
};

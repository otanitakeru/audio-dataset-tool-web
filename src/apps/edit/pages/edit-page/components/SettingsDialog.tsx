import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Switch,
} from "@mui/material";
import React from "react";
import type { CursorBehavior, StopBehavior } from "../../../types";

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  stopBehavior: StopBehavior;
  setStopBehavior: (behavior: StopBehavior) => void;
  cursorBehavior: CursorBehavior;
  setCursorBehavior: (behavior: CursorBehavior) => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  open,
  onClose,
  stopBehavior,
  setStopBehavior,
  cursorBehavior,
  setCursorBehavior,
}) => {
  return (
    <Dialog open={open}>
      <DialogTitle>設定</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ minWidth: 300, mt: 1 }}>
          <FormControl>
            <FormLabel id="stop-behavior-label">停止時の挙動</FormLabel>
            <FormControlLabel
              control={
                <Switch
                  checked={stopBehavior === "return_to_start"}
                  onChange={(e) =>
                    setStopBehavior(
                      e.target.checked ? "return_to_start" : "pause_at_current"
                    )
                  }
                />
              }
              label="停止時に開始位置に戻る"
            />
          </FormControl>

          <FormControl>
            <FormLabel id="cursor-behavior-label">カーソルの挙動</FormLabel>
            <RadioGroup
              aria-labelledby="cursor-behavior-label"
              value={cursorBehavior}
              onChange={(e) =>
                setCursorBehavior(e.target.value as CursorBehavior)
              }
            >
              <FormControlLabel
                value="fixed_center"
                control={<Radio />}
                label="カーソルを中央で固定"
              />
              <FormControlLabel
                value="moving"
                control={<Radio />}
                label="カーソルを動かす"
              />
            </RadioGroup>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>閉じる</Button>
      </DialogActions>
    </Dialog>
  );
};

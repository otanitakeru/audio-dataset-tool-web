import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import { IconButton, useTheme } from "@mui/material";

type NavigationButtonProps = {
  onClick: () => void;
  disabled: boolean;
  direction: "prev" | "next";
};

export const NavigationButton = ({
  onClick,
  disabled,
  direction,
}: NavigationButtonProps) => {
  const theme = useTheme();
  const isNext = direction === "next";

  return (
    <IconButton
      onClick={onClick}
      disabled={disabled}
      sx={{
        alignSelf: "center",
        width: 64,
        height: 64,
        bgcolor: isNext ? theme.palette.primary.main : "background.paper",
        color: isNext ? "common.white" : undefined,
        boxShadow: isNext ? 4 : 3,
        "&:hover": {
          bgcolor: isNext ? theme.palette.primary.dark : "background.paper",
          transform: "scale(1.05)",
        },
        "&:disabled": {
          // Next button specific disabled styles
          ...(isNext && {
            bgcolor: "action.disabledBackground",
            color: "action.disabled",
          }),
          // Previous button specific disabled styles
          ...(!isNext && {
            opacity: 0.5,
          }),
          boxShadow: "none",
        },
        transition: "all 0.2s",
      }}
      aria-label={isNext ? "next sentence" : "previous sentence"}
    >
      {isNext ? (
        <NavigateNext sx={{ fontSize: 40 }} />
      ) : (
        <NavigateBefore sx={{ fontSize: 40 }} />
      )}
    </IconButton>
  );
};

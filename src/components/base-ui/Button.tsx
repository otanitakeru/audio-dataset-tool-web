import {
  Button as MuiButton,
  type ButtonProps as MuiButtonProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";

/**
 * カスタムButtonコンポーネントのプロパティ
 */
export interface ButtonProps extends Omit<MuiButtonProps, "variant"> {
  /**
   * ボタンのバリアント
   * @default 'contained'
   */
  variant?: "contained" | "outlined" | "text";
  /**
   * ボタンのサイズ
   * @default 'medium'
   */
  size?: "small" | "medium" | "large";
  /**
   * ボタンの幅を100%にするかどうか
   * @default false
   */
  fullWidth?: boolean;
}

/**
 * スタイル付きButton
 * theme.tsで定義されたカラーとスタイルを適用
 */
const StyledButton = styled(MuiButton)(({ theme }) => ({
  textTransform: "none", // 大文字変換を無効化
  fontWeight: 500,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1, 2),
  transition: "all 0.3s ease-in-out",

  // サイズ別のスタイル
  "&.MuiButton-sizeSmall": {
    padding: theme.spacing(0.5, 1.5),
    fontSize: "0.875rem",
  },
  "&.MuiButton-sizeLarge": {
    padding: theme.spacing(1.5, 3),
    fontSize: "1rem",
  },

  // Containedバリアントのスタイル
  "&.MuiButton-contained": {
    boxShadow: theme.shadows[2],
  },

  // Outlinedバリアントのスタイル
  "&.MuiButton-outlined": {
    borderWidth: "2px",
    "&:hover": {
      borderWidth: "2px",
    },
  },
}));

/**
 * Buttonコンポーネント
 *
 * Material-UIのButtonをラップし、プロジェクト固有のスタイルを適用した
 * 再利用可能なボタンコンポーネント
 *
 * @example
 * ```tsx
 * <Button variant="contained" color="primary" onClick={handleClick}>
 *   Click Me
 * </Button>
 * ```
 */
export const Button = ({
  variant = "contained",
  size = "medium",
  fullWidth = false,
  children,
  ...props
}: ButtonProps) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export type StopBehavior = "pause_at_current" | "return_to_start";
export type CursorBehavior = "fixed_center" | "moving";
export type ActiveDialog = "settings" | "label_input" | "label_edit" | null;

export interface Label {
  id: string; // ラベルの一意識別子
  start: number; // ラベルの開始時間（秒）
  end: number; // ラベルの終了時間（秒）
  name: string; // ラベルの名前（ファイル名になる）
}

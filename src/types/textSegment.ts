/**
 * テキストビューアーのドメインモデル型定義
 */

/**
 * ルビ付きテキストの基本単位
 * 例: "本日(ほんじつ)" -> { base: "本日", ruby: "ほんじつ" }
 */
export interface RubyText {
  /** 基本となるテキスト */
  base: string;
  /** ルビ（ふりがな） */
  ruby: string;
}

/**
 * テキストセグメント
 * プレーンテキストまたはルビ付きテキストのいずれか
 */
export type TextSegment =
  | { type: "plain"; text: string }
  | { type: "ruby"; data: RubyText };

/**
 * テキストセグメント行
 * 複数のテキストセグメントで構成される
 */
export type TextSegmentLine = TextSegment[];

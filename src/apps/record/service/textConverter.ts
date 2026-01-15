import type { TextSegment, TextSegmentLine } from "../types/textSegment";

/**
 * \ruby{base}{ruby} 形式の正規表現パターン
 * 例: \ruby{本日}{ほんじつ}
 */
const RUBY_PATTERN = /\\ruby\{([^}]*)\}\{([^}]*)\}/g;

/**
 * 行番号プレフィックスの正規表現パターン
 * 例: "001 " や "210 " など
 */
const LINE_NUMBER_PATTERN = /^\d+\s+/;

/**
 * 単一行のテキストをTextSegment配列にパースする
 * @param line - パースする行のテキスト（行番号は除去済み）
 * @returns TextSegment配列
 */
const parseLineToSegments = (line: string): TextSegment[] => {
  const segments: TextSegment[] = [];
  let lastIndex = 0;

  // \ruby{base}{ruby} パターンをすべて検索
  const matches = [...line.matchAll(RUBY_PATTERN)];

  for (const match of matches) {
    const matchIndex = match.index!;

    // ルビの前にプレーンテキストがあれば追加
    if (matchIndex > lastIndex) {
      const plainText = line.slice(lastIndex, matchIndex);
      if (plainText) {
        segments.push({ type: "plain", text: plainText });
      }
    }

    // ルビ付きテキストを追加
    const [, base, ruby] = match;
    segments.push({
      type: "ruby",
      data: { base, ruby },
    });

    lastIndex = matchIndex + match[0].length;
  }

  // 残りのプレーンテキストがあれば追加
  if (lastIndex < line.length) {
    const remainingText = line.slice(lastIndex);
    if (remainingText) {
      segments.push({ type: "plain", text: remainingText });
    }
  }

  return segments;
};

/**
 * 行番号プレフィックスを除去する
 * @param line - 元の行テキスト
 * @returns 行番号を除去したテキスト
 */
const removeLineNumberPrefix = (line: string): string => {
  return line.replace(LINE_NUMBER_PATTERN, "");
};

/**
 * ATR形式のテキストファイル内容をTextSegmentLine配列に変換する
 *
 * 入力フォーマット例:
 * ```
 * 001 \ruby{勢}{いきお}い
 * 002 いよいよ
 * 003 \ruby{羨}{うらや}ましい
 * ```
 *
 * @param fileContent - テキストファイルの内容
 * @returns TextSegmentLine配列（各行が1つのTextSegmentLineになる）
 */
export const convertTextFileToSegments = (
  fileContent: string
): TextSegmentLine[] => {
  const lines = fileContent.split("\n");
  const result: TextSegmentLine[] = [];

  for (const line of lines) {
    // 空行はスキップ
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      continue;
    }

    // 行番号プレフィックスを除去
    const textContent = removeLineNumberPrefix(trimmedLine);

    // テキストが空の場合はスキップ
    if (!textContent) {
      continue;
    }

    // セグメントにパースして追加
    const segments = parseLineToSegments(textContent);
    if (segments.length > 0) {
      result.push(segments);
    }
  }

  return result;
};

/**
 * Fileオブジェクトを読み込んでTextSegmentLine配列に変換する
 * @param file - 読み込むファイル
 * @returns TextSegmentLine配列のPromise
 */
export const convertFileToSegments = async (
  file: File
): Promise<TextSegmentLine[]> => {
  const content = await file.text();
  return convertTextFileToSegments(content);
};

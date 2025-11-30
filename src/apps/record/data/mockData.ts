import type { TextSegmentLine } from "../types/textSegment";

export const getTextSegments = (): TextSegmentLine[] => {
  return [
    [
      { type: "plain", text: "こんにちは" },
      { type: "ruby", data: { base: "本日", ruby: "ほんじつ" } },
      { type: "plain", text: "は" },
      { type: "ruby", data: { base: "日曜日", ruby: "にちようび" } },
      { type: "plain", text: "です。" },
    ],
    [
      { type: "plain", text: "この" },
      { type: "ruby", data: { base: "文章", ruby: "ぶんしょう" } },
      { type: "plain", text: "は" },
      { type: "ruby", data: { base: "長", ruby: "なが" } },
      { type: "plain", text: "い" },
      { type: "ruby", data: { base: "文章", ruby: "ぶんしょう" } },
      { type: "plain", text: "の" },
      { type: "ruby", data: { base: "一行目", ruby: "いちぎょうめ" } },
      { type: "plain", text: "です。" },
    ],
    [
      { type: "plain", text: "これは" },
      { type: "ruby", data: { base: "短", ruby: "みじか" } },
      { type: "plain", text: "い" },
      { type: "ruby", data: { base: "例", ruby: "れい" } },
      { type: "plain", text: "です。" },
    ],
  ];
};

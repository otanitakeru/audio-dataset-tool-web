import type { TextSegment, TextSegmentLine } from "../../types/textSegment";

const getTextSegments = (): TextSegmentLine => {
  return [
    { type: "plain", text: "こんにちは" },
    { type: "ruby", data: { base: "本日", ruby: "ほんじつ" } },
    { type: "plain", text: "は" },
    { type: "ruby", data: { base: "日曜日", ruby: "にちようび" } },
    { type: "plain", text: "です。" },
  ];
};

const renderText = (text: TextSegmentLine): React.ReactNode => {
  return text.map((segment: TextSegment) => {
    if (segment.type === "plain") {
      return <span>{segment.text}</span>;
    }
    return (
      <ruby>
        {segment.data.base}
        <rt>{segment.data.ruby}</rt>
      </ruby>
    );
  });
};

const TextViewer = () => {
  return <div>{renderText(getTextSegments())}</div>;
};

export default TextViewer;

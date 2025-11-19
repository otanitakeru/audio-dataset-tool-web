import type { TextSegment, TextSegmentLine } from "../../../types/textSegment";

type TextViewerProps = {
  textSegments: TextSegmentLine;
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

const TextViewer = ({ textSegments }: TextViewerProps) => {
  return <div>{renderText(textSegments)}</div>;
};

export default TextViewer;

import { Box } from "@mui/material";
import type { TextSegmentLine } from "../../../types/textSegment";

type TextDisplayProps = {
  textSegments: TextSegmentLine;
};

export const TextDisplay = ({ textSegments }: TextDisplayProps) => {
  return (
    <Box
      sx={{
        typography: "h2",
        lineHeight: 2,
        textAlign: "center",
        "& rt": {
          fontSize: "0.5em",
          color: "text.secondary",
        },
      }}
    >
      {textSegments.map((segment, index) => {
        if (segment.type === "plain") {
          //   HACK: keyをindexとしている
          return <span key={index}>{segment.text}</span>;
        }
        return (
          <ruby key={index}>
            {segment.data.base}
            <rt>{segment.data.ruby}</rt>
          </ruby>
        );
      })}
    </Box>
  );
};

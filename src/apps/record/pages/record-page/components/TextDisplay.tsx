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
        "& rt": {
          fontSize: "0.5em",
          color: "text.secondary",
        },
      }}
    >
      {textSegments.map((segment, index) => {
        switch (segment.type) {
          case "plain":
            return <span key={index}>{segment.text}</span>;
          case "ruby":
            return (
              <ruby key={index}>
                {segment.data.base}
                <rt>{segment.data.ruby}</rt>
              </ruby>
            );
          case "br":
            return <br key={index} />;
        }
      })}
    </Box>
  );
};

import React from "react";
import { Tooltip } from "antd";
import { Keyword } from "../typings";

interface HighlightedTextProps {
  text: string;
  keywords: Keyword[];
}

const HighlightedText: React.FC<HighlightedTextProps> = ({
  text,
  keywords,
}) => {
  const keywordLabels = keywords.map((keyword) => keyword.label);

  const words = text.split(/(\s+)/).map((word, index) => {
    const keywordIndex = keywordLabels.indexOf(word.toLowerCase());

    if (keywordIndex >= 0) {
      const keyword = keywords[keywordIndex];
      const tooltipText = `Score: ${keyword.score.toFixed(2)}`;

      return (
        <Tooltip title={tooltipText} key={index}>
          <span className="highlighted-word bg-yellow-300">{word}</span>
        </Tooltip>
      );
    }
    return <React.Fragment key={index}>{word}</React.Fragment>;
  });

  return <div className="highlighted-text">{words}</div>;
};

export default HighlightedText;

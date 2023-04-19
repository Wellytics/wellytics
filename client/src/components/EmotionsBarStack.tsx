import React from "react";
import { BarStack } from "@visx/shape";
import { Group } from "@visx/group";
import { Grid } from "@visx/grid";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { Emotion } from "../typings";
import { useTooltip, useTooltipInPortal, defaultStyles } from "@visx/tooltip";

export type EmotionsBarStackProps = {
  width: number;
  height: number;
  margin?: { top: number; left: number };
  data: Record<string, Array<Emotion>>;
};

type FormattedData = { label: string } & Record<string, number>;

const getLabel = (d: Emotion) => d.label;
const getScore = (d: Emotion) => d.score;

const tooltipStyles = {
  ...defaultStyles,
  background: "rgba(0, 0, 0, 0.9)",
  color: "white",
};

const defaultMargin = { top: 0, left: 0 };

const labelScale = scaleBand<string>({});

const scoreScale = scaleLinear<number>({});

const background = "#eaedff";

const emotionsColor: Record<string, string> = {
  caring: "#FADADD",
  approval: "#A8E6CF",
  disapproval: "#FFD3B6",
  realization: "#C3AED6",
  remorse: "#9DC3C1",
  desire: "#FFAAA5",
  curiosity: "#FFDAC1",
  excitement: "#FF9AA2",
  pride: "#B5EAD7",
  confusion: "#E0BBE4",
  relief: "#C7CEEA",
  admiration: "#F7E1D7",
  surprise: "#F9B5AC",
  neutral: "#D5E2E6",
  grief: "#A2D2FF",
  annoyance: "#F0E6EF",
  anger: "#FAC8BF",
  fear: "#C7D3D4",
  optimism: "#E2F0CB",
  nervousness: "#FFDFD3",
  disgust: "#D9D2E9",
  joy: "#FFD6E9",
  gratitude: "#DCE9BE",
  embarrassment: "#FCCDD3",
  amusement: "#F0E0B8",
  sadness: "#AEC6CF",
  love: "#FFB7B2",
  disappointment: "#C9CAD9",
};

const targetEmotions = [
  "caring",
  "approval",
  "disapproval",
  "realization",
  "remorse",
  "desire",
  "curiosity",
  "excitement",
  "pride",
  "confusion",
  "relief",
  "admiration",
  "surprise",
  "neutral",
  "grief",
  "annoyance",
  "anger",
  "fear",
  "optimism",
  "nervousness",
  "disgust",
  "joy",
  "gratitude",
  "embarrassment",
  "amusement",
  "sadness",
  "love",
  "disappointment",
];

const colors = targetEmotions.map((emotion) => emotionsColor[emotion]);

const colorScale = scaleOrdinal<string, string>({
  range: colors,
});

export function EmotionsBarStack({
  width,
  height,
  margin = defaultMargin,
  data,
}: EmotionsBarStackProps) {
  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    showTooltip,
    hideTooltip,
  } = useTooltip<string>();

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
  });

  // bounds
  const xMax = width;
  const yMax = height - margin.top;

  // strings: uuids
  const labels: string[] = Object.keys(data);

  // strings: emotion labels
  const keys: string[] = Array.from(new Set(data[labels[0]].map(getLabel)));

  labelScale.domain(labels).rangeRound([0, xMax]);
  scoreScale
    .domain([
      0,
      Math.max(
        ...labels.map((label) =>
          data[label].reduce((acc, cur) => acc + getScore(cur), 0)
        )
      ),
    ])
    .range([yMax, 0]);
  colorScale.domain(keys);

  const formattedData = labels.map((label) => {
    const obj = { label } as FormattedData;
    data[label].forEach((emotion) => (obj[emotion.label] = emotion.score));
    return obj;
  });

  return width < 10 ? null : (
    <div style={{ position: "relative" }}>
      <svg ref={containerRef} width={width} height={height}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={background}
          rx={14}
        />

        <Grid
          top={margin.top}
          left={margin.left}
          xScale={labelScale}
          yScale={scoreScale}
          width={xMax}
          height={yMax}
          stroke="black"
          strokeOpacity={0.1}
          xOffset={labelScale.bandwidth() / 2}
        />
        <Group top={margin.top}>
          <BarStack<FormattedData, string>
            data={formattedData}
            keys={keys}
            x={(d) => d.label}
            xScale={labelScale}
            yScale={scoreScale}
            color={colorScale}
          >
            {(barStacks) =>
              barStacks.map((barStack) =>
                barStack.bars.map((bar) => (
                  <rect
                    key={`bar-stack-${barStack.index}-${bar.index}`}
                    x={bar.x}
                    y={bar.y}
                    height={bar.height}
                    width={bar.width}
                    fill={bar.color}
                    onMouseEnter={() =>
                      showTooltip({
                        tooltipLeft: bar.x + bar.width / 2,
                        tooltipTop: bar.y + bar.height / 2,
                        tooltipData: bar.key,
                      })
                    }
                    onMouseLeave={hideTooltip}
                  />
                ))
              )
            }
          </BarStack>
        </Group>
      </svg>

      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          top={tooltipTop}
          left={tooltipLeft}
          style={tooltipStyles}
        >
          {tooltipData}
        </TooltipInPortal>
      )}
    </div>
  );
}

import type { CrossType } from "@core";
import type { MonthData } from "../../utils/projectionTypes";
import { COLOR_CARD_STROKE, COLOR_CUSHION, COLOR_CUSHION_LOST, COLOR_NEGATIVE, COLOR_POSITIVE } from "./balanceChartColors";


export interface CrossingDotProps {
    cx?: number;
    cy?: number;
    index?: number;
    payload?: MonthData & {
        _crossCapital?: CrossType;
        _crossCushion?: CrossType;
        _crossRisk?: CrossType;
    };
}

export const CrossingDot = (props: CrossingDotProps) => {
    const { cx, cy, payload } = props;
    if (!cx || !cy || !payload) return null;

    if (payload._crossCapital === "gained") {
        return (
            <g>
                <circle cx={cx} cy={cy} r={18} fill={COLOR_POSITIVE} fillOpacity={0.12} />
                <circle cx={cx} cy={cy} r={11} fill={COLOR_POSITIVE} fillOpacity={0.22} />
                <circle cx={cx} cy={cy} r={6} fill={COLOR_POSITIVE} stroke={COLOR_CARD_STROKE} strokeWidth={2.5} />
                <path
                    d={`M${cx - 3} ${cy} l2 2.5 l4.5 -4.5`}
                    stroke={COLOR_CARD_STROKE} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" fill="none"
                />
            </g>
        );
    }

    if (payload._crossCapital === "lost") {
        return (
            <g>
                <circle cx={cx} cy={cy} r={14} fill={COLOR_NEGATIVE} fillOpacity={0.15} />
                <circle cx={cx} cy={cy} r={8} fill={COLOR_NEGATIVE} fillOpacity={0.22} />
                <circle cx={cx} cy={cy} r={5} fill={COLOR_NEGATIVE} stroke={COLOR_CARD_STROKE} strokeWidth={2.5} />
                <path
                    d={`M${cx - 3} ${cy - 3} l6 6 M${cx + 3} ${cy - 3} l-6 6`}
                    stroke={COLOR_CARD_STROKE} strokeWidth={1.8} strokeLinecap="round" fill="none"
                />
            </g>
        );
    }

    if (payload._crossCushion === "gained") {
        return (
            <g>
                <circle cx={cx} cy={cy} r={14} fill={COLOR_CUSHION} fillOpacity={0.15} />
                <circle cx={cx} cy={cy} r={8} fill={COLOR_CUSHION} fillOpacity={0.25} />
                <circle cx={cx} cy={cy} r={5} fill={COLOR_CUSHION} stroke={COLOR_CARD_STROKE} strokeWidth={2} />
            </g>
        );
    }

    if (payload._crossCushion === "lost") {
        return (
            <g>
                <circle cx={cx} cy={cy} r={14} fill={COLOR_CUSHION_LOST} fillOpacity={0.15} />
                <circle cx={cx} cy={cy} r={8} fill={COLOR_CUSHION_LOST} fillOpacity={0.22} />
                <circle cx={cx} cy={cy} r={5} fill={COLOR_CUSHION_LOST} stroke={COLOR_CARD_STROKE} strokeWidth={2} />
            </g>
        );
    }

    if (payload._crossRisk === "lost") {
        return (
            <g>
                <circle cx={cx} cy={cy} r={14} fill={COLOR_NEGATIVE} fillOpacity={0.12} />
                <circle cx={cx} cy={cy} r={8} fill={COLOR_NEGATIVE} fillOpacity={0.20} />
                <circle cx={cx} cy={cy} r={5} fill={COLOR_NEGATIVE} stroke={COLOR_CARD_STROKE} strokeWidth={2} />
                <path d={`M${cx - 2.5} ${cy - 4} L${cx + 2.5} ${cy - 4} L${cx} ${cy + 3} Z`} fill={COLOR_CARD_STROKE} />
            </g>
        );
    }

    if (payload._crossRisk === "gained") {
        return (
            <g>
                <circle cx={cx} cy={cy} r={14} fill={COLOR_POSITIVE} fillOpacity={0.12} />
                <circle cx={cx} cy={cy} r={8} fill={COLOR_POSITIVE} fillOpacity={0.20} />
                <circle cx={cx} cy={cy} r={5} fill={COLOR_POSITIVE} stroke={COLOR_CARD_STROKE} strokeWidth={2} />
                <path d={`M${cx - 2.5} ${cy + 4} L${cx + 2.5} ${cy + 4} L${cx} ${cy - 3} Z`} fill={COLOR_CARD_STROKE} />
            </g>
        );
    }

    return null;
};
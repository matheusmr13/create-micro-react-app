import * as React from 'react';
import { PresetColorType, PresetStatusColorType } from '../_util/colors';
import { LiteralUnion } from '../_util/type';
export { ScrollNumberProps } from './ScrollNumber';
export interface BadgeProps {
    /** Number to show in badge */
    count?: React.ReactNode;
    showZero?: boolean;
    /** Max count to show */
    overflowCount?: number;
    /** whether to show red dot without number */
    dot?: boolean;
    style?: React.CSSProperties;
    prefixCls?: string;
    scrollNumberPrefixCls?: string;
    className?: string;
    status?: PresetStatusColorType;
    color?: LiteralUnion<PresetColorType, string>;
    text?: React.ReactNode;
    offset?: [number | string, number | string];
    title?: string;
}
declare const Badge: React.FC<BadgeProps>;
export default Badge;

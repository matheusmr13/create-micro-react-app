import * as React from 'react';
import { TooltipPlacement } from '../tooltip';
export interface SliderMarks {
    [key: number]: React.ReactNode | {
        style: React.CSSProperties;
        label: React.ReactNode;
    };
}
export declare type SliderValue = number | [number, number];
interface HandleGeneratorInfo {
    value: number;
    dragging: boolean;
    index: number;
    rest: any[];
}
export declare type HandleGeneratorFn = (config: {
    tooltipPrefixCls?: string;
    prefixCls?: string;
    info: HandleGeneratorInfo;
}) => React.ReactNode;
export interface SliderProps {
    prefixCls?: string;
    tooltipPrefixCls?: string;
    range?: boolean;
    reverse?: boolean;
    min?: number;
    max?: number;
    step?: number | null;
    marks?: SliderMarks;
    dots?: boolean;
    value?: SliderValue;
    defaultValue?: SliderValue;
    included?: boolean;
    disabled?: boolean;
    vertical?: boolean;
    onChange?: (value: SliderValue) => void;
    onAfterChange?: (value: SliderValue) => void;
    tipFormatter?: null | ((value: number) => React.ReactNode);
    className?: string;
    id?: string;
    style?: React.CSSProperties;
    tooltipVisible?: boolean;
    tooltipPlacement?: TooltipPlacement;
    getTooltipPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
}
export declare type Visibles = {
    [index: number]: boolean;
};
declare const Slider: React.ForwardRefExoticComponent<SliderProps & React.RefAttributes<unknown>>;
export default Slider;

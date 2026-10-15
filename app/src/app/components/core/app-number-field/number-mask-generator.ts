import { MaskitoOptions } from '@maskito/core';
import { maskitoNumber } from '@maskito/kit';

export interface NumberMaskConfig {
    allowNegative?:    boolean,
    maxDecimalDigits?: number
}

export const createNumberMask = (config: NumberMaskConfig = {}): MaskitoOptions => maskitoNumber({
    minusSign:             config.allowNegative    ? '-'                     : '',
    maximumFractionDigits: config.maxDecimalDigits ? config.maxDecimalDigits : 0,
    thousandSeparator:     ''
});

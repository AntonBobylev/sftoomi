import { MaskitoOptions } from '@maskito/core';
import { maskitoNumber } from '@maskito/kit';

export interface NumberMaskConfig {
    allowNegative?:    boolean,
    maxDecimalDigits?: number
}

export function createNumberMask(config: NumberMaskConfig = {}): MaskitoOptions {
    return maskitoNumber({
        minusSign:             config.allowNegative    ? '-'                     : '',
        maximumFractionDigits: config.maxDecimalDigits ? config.maxDecimalDigits : 0,
        thousandSeparator:     ''
    });
}

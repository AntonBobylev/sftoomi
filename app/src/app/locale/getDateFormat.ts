import Sftoomi from '../class/Sftoomi';
import { TuiDateFormatSettings } from '@taiga-ui/core';

export default function getDateFormat(): TuiDateFormatSettings
{
    switch (Sftoomi.Translator.getLocale()) {
        case 'ru':
            return {mode: 'DMY', separator: '.'}
    }

    return { mode: 'MDY', separator: '/' };
}

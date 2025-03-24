import { TuiDateFormatSettings } from '@taiga-ui/core'
    ;
import Sftoomi from '../class/Sftoomi';

export default function getTuiLocalDateFormat(): TuiDateFormatSettings
{
    switch (Sftoomi.Translator.getLocale()) {
        case 'ru':
            return { mode: 'DMY', separator: '.' }
    }

    return { mode: 'MDY', separator: '/' };
}

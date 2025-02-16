import { TuiDateFormatSettings } from '@taiga-ui/core'
    ;
import Sftoomi from '../class/Sftoomi';

export default function getDateFormat(): TuiDateFormatSettings
{
    switch (Sftoomi.Translator.getLocale()) {
        case 'ru':
            return { mode: 'DMY', separator: '.' }
    }

    return { mode: 'MDY', separator: '/' };
}

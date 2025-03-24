import {TuiDayOfWeek} from '@taiga-ui/cdk';

import Sftoomi from '../class/Sftoomi';

export default function getLocalFirstDayOfWeek(): number
{
    switch (Sftoomi.Translator.getLocale()) {
        case 'ru':
            return TuiDayOfWeek.Monday;
    }

    return TuiDayOfWeek.Sunday;
}

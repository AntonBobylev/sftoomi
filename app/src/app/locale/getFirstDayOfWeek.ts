import Sftoomi from '../class/Sftoomi';

export default function getFirstDayOfWeek(): number
{
    switch (Sftoomi.Translator.getLocale()) {
        case 'ru':
            return 1;
        default:
            return 0;
    }
}

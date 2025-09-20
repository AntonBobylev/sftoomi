import Sftoomi from '../class/Sftoomi';

export default function getDatePickerLocalDateFormat(): string
{
    switch (Sftoomi.Translator.getLocale()) {
        case 'ru':
            return 'dd.MM.yyyy';
    }

    return 'MM/dd/yyyy';
}

import Sftoomi from '../class/Sftoomi';

export type MomentDateFormat = {
    date:            string,
    date_time:       string,
    date_time_short: string
};

export default function getLocalDateFormat(): MomentDateFormat
{
    switch (Sftoomi.Translator.getLocale()) {
        case 'ru':
            return {
                date: 'dd.MM.yyyy',
                date_time: 'dd.MM.yyyy HH:mm:ss',
                date_time_short: 'dd.MM.yyyy HH:mm'
            };
    }

    return {
        date: 'MM/dd/yyyy',
        date_time: 'MM/dd/yyyy HH:mm:ss a',
        date_time_short: 'MM/dd/yyyy HH:mm a'
    };
}

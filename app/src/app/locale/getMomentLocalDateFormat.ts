import Sftoomi from '../class/Sftoomi';

export type MomentDateFormat = {
    date: string,
    date_time: string,
    date_time_short: string
};

export default function getMomentLocalDateFormat(): MomentDateFormat
{
    switch (Sftoomi.Translator.getLocale()) {
        case 'ru':
            return {
                date: 'DD.MM.YYYY',
                date_time: 'DD.MM.YYYY HH:mm:ss',
                date_time_short: 'DD.MM.YYYY HH:mm'
            };
    }

    return {
        date: 'MM/DD/YYYY',
        date_time: 'MM/DD/YYYY hh:mm:ss A',
        date_time_short: 'MM/DD/YYYY hh:mm A'
    };
}

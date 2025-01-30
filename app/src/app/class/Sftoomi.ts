import moment from 'moment';

export default class Sftoomi
{
    /**
     * Returns current year number
     */
    public static getCurrentYear(): number
    {
        return (new Date()).getFullYear();
    }

    /**
     * Checks is variable an array
     *
     * @param variable
     */
    public static isArray(variable: any): boolean
    {
        return toString.apply(variable) === '[object Array]';
    }

    /**
     * Checks is variable a date
     *
     * @param variable
     */
    public static isDate(variable: any): boolean
    {
        return variable instanceof Date;
    }

    public static dateShort(date?: string | null | Date): string | null
    {
        if (!date) {
            return '';
        }

        return moment(date).format('MM/DD/YYYY');
    }
}

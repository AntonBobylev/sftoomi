export default class Constants
{
    public readonly types = {
        int: {
            min: -2147483648,
            max: 2147483647,
            unsigned: 4294967295
        }
    }

    public readonly dateIsoFormat: string = 'YYYY-MM-DD'
}

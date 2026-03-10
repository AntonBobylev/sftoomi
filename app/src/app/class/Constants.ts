export default class Constants
{
    public readonly types = {
        int: {
            min: -2147483648,
            max: 2147483647,
            unsigned: 4294967295
        }
    }

    public readonly dateIsoFormat: string = 'yyyy-MM-dd'

    public readonly codeEditorDefaultOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
        language: 'html',
        minimap: {
            enabled: false
        },
        scrollbar: {
            verticalScrollbarSize: 5
        }
    }

    public readonly encodedPdfBase64Prefix: string = 'data:application/pdf;base64,';

    public readonly checkAuthTimeoutInMs: number = 30 * 1000; // 30 seconds
}

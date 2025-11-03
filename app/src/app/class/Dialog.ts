import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

import Sftoomi from './Sftoomi';

export enum DialogType {
    INFO,
    WARNING,
    ERROR
}

export type DialogConfig = {
    width?: number | string,
    maxWidth?: number | string
};

export default class Dialog
{
    private dialog!: NzModalService;

    private initialized: boolean = false;

    public init(dialog: NzModalService): void
    {
        this.dialog = dialog;

        this.initialized = true;
    }

    public getInstance(): NzModalService
    {
        return this.dialog;
    }

    public show(message: string, type: DialogType = DialogType.INFO, callback?: Function, config?: DialogConfig): void
    {
        if (!this.initialized) {
            console.error('Dialog is not initialized yet');

            return;
        }

        let header;
        switch (type) {
            case DialogType.INFO:
                header = Sftoomi.Translator.translate('information');
                break;
            case DialogType.WARNING:
                header = Sftoomi.Translator.translate('warning');
                break;
            case DialogType.ERROR:
                header = Sftoomi.Translator.translate('error');
                break;
        }

        const width: string | undefined = this.getStyleDimensionValue(config?.width),
              maxWidth: string | undefined = this.getStyleDimensionValue(config?.maxWidth);

        const dialog: NzModalRef = this.dialog.create({
            nzTitle: header,
            nzContent: message,
            nzDraggable: true,
            nzWidth: Sftoomi.isEmpty(width) ? 'auto' : width,
            nzStyle: { 'max-width': Sftoomi.isEmpty(maxWidth) ? '100%' : maxWidth },
            nzClosable: false,
            nzMaskClosable: false,
            nzCentered: true,
            nzFooter: [{
                label: Sftoomi.Translator.translate('ok'),
                onClick: () => dialog.destroy()
            }]
        });

        dialog.afterClose.subscribe((): void => {
            if (callback) {
                callback();
            }
        });
    }

    private getStyleDimensionValue(value: undefined | string | number): string | undefined
    {
        if (Sftoomi.isEmpty(value)) {
            return undefined;
        }

        return typeof value === 'number'
            ? value + 'px'
            : value + '%';
    }
}

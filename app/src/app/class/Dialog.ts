import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

import Sftoomi from './Sftoomi';

export enum DialogType {
    INFO,
    WARNING,
    ERROR
}

export default class Dialog
{
    private dialog!: NzModalService;

    private initialized: boolean = false;

    public init(dialog: NzModalService): void
    {
        this.dialog = dialog;

        this.initialized = true;
    }

    public show(message: string, type: DialogType = DialogType.INFO, callback?: Function): void
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

        const dialog: NzModalRef = this.dialog.create({
            nzTitle: header,
            nzContent: message,
            nzClosable: false,
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
}

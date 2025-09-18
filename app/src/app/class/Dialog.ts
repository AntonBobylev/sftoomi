import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

import Sftoomi from './Sftoomi';

import { InformationDialogType } from '../services/information-dialog.service';

export default class Dialog
{
    private dialog!: NzModalService;

    private initialized: boolean = false;

    public init(dialog: NzModalService): void
    {
        this.dialog = dialog;

        this.initialized = true;
    }

    public show(message: string, type: InformationDialogType = InformationDialogType.INFO, callback?: Function): void
    {
        if (!this.initialized) {
            console.error('Dialog is not initialized yet');

            return;
        }

        let header;
        switch (type) {
            case InformationDialogType.INFO:
                header = Sftoomi.Translator.translate('information');
                break;
            case InformationDialogType.WARNING:
                header = Sftoomi.Translator.translate('warning');
                break;
            case InformationDialogType.ERROR:
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

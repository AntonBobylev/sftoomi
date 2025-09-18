import { inject, Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

import Sftoomi from '../class/Sftoomi';

export enum InformationDialogType {
    INFO,
    WARNING,
    ERROR
}

@Injectable({
    providedIn: 'root'
})

export default class InformationDialogService
{
    private readonly dialog: NzModalService = inject(NzModalService);

    constructor(private readonly domSanitizer: DomSanitizer) {}

    public show(message: string, type: InformationDialogType = InformationDialogType.INFO, callback?: Function): void
    {
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

        let dialog: NzModalRef = this.dialog.create({
            nzTitle: header,
            nzContent: this.domSanitizer.bypassSecurityTrustHtml(message).toString(),
            nzClosable: false
        });

        dialog.afterClose.subscribe((): void => {
            if (callback) {
                callback();
            }
        });
    }
}

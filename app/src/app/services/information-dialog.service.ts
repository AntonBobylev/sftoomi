import { inject, Injectable } from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';

import Sftoomi from '../class/Sftoomi';
import { DomSanitizer } from '@angular/platform-browser';

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
    private readonly dialog: TuiDialogService = inject(TuiDialogService);

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

        this.dialog.open(
            this.domSanitizer.bypassSecurityTrustHtml(message),
            {label: header, size: 'auto', dismissible: false}
        ).subscribe((): void => {
            if (callback) {
                callback();
            }
        });
    }
}

import { inject, Injectable } from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';

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

    public show(message: string, type: InformationDialogType = InformationDialogType.INFO, callback?: Function): void
    {
        let header;
        switch (type) {
            case InformationDialogType.INFO:
                header = 'Information';
                break;
            case InformationDialogType.WARNING:
                header = 'Warning';
                break;
            case InformationDialogType.ERROR:
                header = 'Error';
                break;
        }

        this.dialog.open(
            message,
            {label: header, size: 'auto'}
        ).subscribe((): void => {
            if (callback) {
                callback();
            }
        });
    }
}

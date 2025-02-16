import { inject, Injectable } from '@angular/core';
import { TuiAlertService, TuiAppearanceOptions } from '@taiga-ui/core';

import Sftoomi from '../class/Sftoomi';

@Injectable({
    providedIn: 'root'
})
export default class PopupMsgService
{
    private readonly popupMsg: TuiAlertService = inject(TuiAlertService);

    private readonly defaultTimeout: number = 5000; // ms

    public show(msg: string, header: string, timeoutMs?: number, callback?: Function, appearance?: TuiAppearanceOptions['appearance']): void {
        this.popupMsg
            .open(msg, {label: header, autoClose: timeoutMs ?? this.defaultTimeout, appearance: appearance ?? 'info'})
            .subscribe((): void => {
                if (callback) {
                    callback();
                }
            });
    }

    public info(msg: string, header?: string, timeoutMs?: number, callback?: Function): void
    {
        this.show(msg, header ?? Sftoomi.Translator.translate('information'), timeoutMs, callback, 'info');
    }

    public warning(msg: string, header?: string, timeoutMs?: number, callback?: Function): void
    {
        this.show(msg, header ?? Sftoomi.Translator.translate('warning'), timeoutMs, callback, 'warning');
    }

    public error(msg: string, header?: string, timeoutMs?: number, callback?: Function): void
    {
        this.show(msg, header ?? Sftoomi.Translator.translate('error'), timeoutMs, callback, 'negative');
    }

    public nothingSelected(timeoutMs?: number): void
    {
        this.warning(Sftoomi.Translator.translate('popup.nothing_selected'), undefined, timeoutMs);
    }

    public moreThanOneSelected(timeoutMs?: number): void
    {
        this.warning(Sftoomi.Translator.translate('popup.more_than_one_selected'), undefined, timeoutMs);
    }

    public formInvalid(timeoutMs?: number): void
    {
        this.warning(Sftoomi.Translator.translate('popup.form_invalid'), undefined, timeoutMs);
    }
}

import { inject, Injectable } from '@angular/core';
import { TuiAlertService, TuiAppearanceOptions } from '@taiga-ui/core';

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
        this.show(msg, header ?? 'Information', timeoutMs, callback, 'info');
    }

    public warning(msg: string, header?: string, timeoutMs?: number, callback?: Function): void
    {
        this.show(msg, header ?? 'Warning', timeoutMs, callback, 'warning');
    }

    public error(msg: string, header?: string, timeoutMs?: number, callback?: Function): void
    {
        this.show(msg, header ?? 'Error', timeoutMs, callback, 'negative');
    }

    public nothingSelected(timeoutMs?: number): void
    {
        this.warning('Nothing selected', undefined, timeoutMs);
    }

    public moreThanOneSelected(timeoutMs?: number): void
    {
        this.warning('More than one record selected. Please, select a single record', undefined, timeoutMs);
    }
}

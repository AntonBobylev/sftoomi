import { Injectable, signal, WritableSignal } from '@angular/core';
import { fromEvent } from 'rxjs';

@Injectable()
export default class NetworkService
{
    private online: WritableSignal<boolean> = signal<boolean>(true);

    constructor()
    {
        this.online.set(window.navigator.onLine);

        fromEvent(window, 'online').subscribe((_e: Event): void => {
            this.online.set(true)
        });

        fromEvent(window, 'offline').subscribe((_e: Event): void => {
            this.online.set(false);
        });
    }

    public isOnline(): boolean
    {
        return this.online();
    }
}

import { signal, WritableSignal } from '@angular/core'

import Sftoomi from './Sftoomi';
import Fetcher from './Fetcher'
import { DialogType } from './Dialog'

import SftoomiCookie from '../enumerations/SftoomiCookies.enumeration';

export default class Auth
{
    private readonly authorized: WritableSignal<boolean> = signal<boolean>(false);

    private sessionId: string | null = null;
    private userId:    number | null = null;

    private readonly checkAuthorizedUrl: string = '/checkAuthorized';
    private readonly logonUrl: string = '/login';
    private readonly logoutUrl: string = '/logout';

    public getIsAuthorizedSignal(): WritableSignal<boolean>
    {
        return this.authorized;
    }

    public tryRestoreSession(callback: Function): void
    {
        let sessionId: string = Sftoomi.Cookies.getCookie(SftoomiCookie.SFTOOMI_SESSION),
            userId: string = Sftoomi.Cookies.getCookie(SftoomiCookie.SFTOOMI_USER);

        if (!Sftoomi.isEmpty(sessionId) && !Sftoomi.isEmpty(userId)) {
            new Fetcher().request({
                url: this.checkAuthorizedUrl,
                success: (_response: any, _request: any, result: any): void => {
                    if (!result.success) {
                        this.unAuthorize(false);

                        return;
                    }

                    this.authorize(
                        sessionId,
                        parseInt(userId)
                    );
                },
                failure: (_code: any, message: any, _request: any): void => {
                    Sftoomi.Dialog.show(message, DialogType.ERROR);
                    this.unAuthorize(false);
                },
                finally: callback
            });

            return;
        }

        callback();
    }

    public login(
        login: string, password: string,
        isLoading?: WritableSignal<boolean>,
        successCallback?: Function,
        failureCallback?: Function
    ): void
    {
        let data: FormData = new FormData();

        data.append('login', login);
        data.append('password', password);

        isLoading?.set(true);
        new Fetcher().request({
            url: this.logonUrl,
            data: data,
            success: (_response: any, _request: any, result: any): void => {
                if (!result.success) {
                    Sftoomi.Dialog.show(result.error, DialogType.ERROR);

                    return;
                }

                Sftoomi.Auth.authorize(result.session_id, result.user.id);
                Sftoomi.runMethodIfExists(successCallback);
            },
            failure: (_code: any, message: any, _request: any): void => {
                Sftoomi.Dialog.show(message, DialogType.ERROR);
                Sftoomi.runMethodIfExists(failureCallback);
            },
            finally: (): void => {
                isLoading?.set(false);
            }
        });
    }

    public logout(
        isLoading?: WritableSignal<boolean>,
        successCallback?: Function,
        failureCallback?: Function,
    ): void
    {
        isLoading?.set(true);
        new Fetcher().request({
            url: this.logoutUrl,
            success: (_response: any, _request: any, _result: any): void => {
                this.unAuthorize();
                Sftoomi.runMethodIfExists(successCallback);
            },
            failure: (_code: any, message: any, _request: any): void => {
                Sftoomi.Dialog.show(message, DialogType.ERROR);
                Sftoomi.runMethodIfExists(failureCallback);
            },
            finally: (): void => {
                isLoading?.set(false);
            }
        });
    }

    private authorize(sessionId: string, userId: number): void
    {
        this.authorized.set(true);
        this.sessionId = sessionId;
        this.userId = userId;

        Sftoomi.Cookies.setCookie(
            SftoomiCookie.SFTOOMI_SESSION,
            this.sessionId,
            1
        );

        Sftoomi.Cookies.setCookie(
            SftoomiCookie.SFTOOMI_USER,
            this.userId.toString(),
            1
        );
    }

    private unAuthorize(cleanCookies: boolean = true): void
    {
        this.authorized.set(false);
        this.sessionId = null;
        this.userId = null;

        if (cleanCookies) {
            Sftoomi.Cookies.deleteCookie(SftoomiCookie.SFTOOMI_SESSION);
            Sftoomi.Cookies.deleteCookie(SftoomiCookie.SFTOOMI_USER);
        }
    }
}

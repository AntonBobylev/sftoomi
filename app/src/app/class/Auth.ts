import Sftoomi from './Sftoomi';

import SftoomiCookie from '../enumerations/SftoomiCookies.enumeration';

export default class Auth
{
    private authorized: boolean = false;

    private sessionId: string | null = null;
    private userId:    number | null = null;

    public isAuthorized(): boolean
    {
        return this.authorized;
    }

    public tryRestoreSession(): void
    {
        let sessionId: string = Sftoomi.Cookies.getCookie(SftoomiCookie.SFTOOMI_SESSION),
            userId: string = Sftoomi.Cookies.getCookie(SftoomiCookie.SFTOOMI_USER);

        if (!Sftoomi.isEmpty(sessionId) && !Sftoomi.isEmpty(userId)) {
            this.authorize(
                sessionId,
                parseInt(userId)
            );
        }
    }

    public authorize(sessionId: string, userId: number): void
    {
        this.authorized = true;
        this.sessionId = sessionId;
        this.userId = userId;

        Sftoomi.Cookies.setCookie(
            SftoomiCookie.SFTOOMI_SESSION,
            this.sessionId,
            365
        );

        Sftoomi.Cookies.setCookie(
            SftoomiCookie.SFTOOMI_USER,
            this.userId.toString(),
            365
        );
    }

    public unAuthorize(): void
    {
        this.authorized = false;
        this.sessionId = null;
        this.userId = null;

        Sftoomi.Cookies.deleteCookie(SftoomiCookie.SFTOOMI_SESSION);
        Sftoomi.Cookies.deleteCookie(SftoomiCookie.SFTOOMI_USER);
    }
}

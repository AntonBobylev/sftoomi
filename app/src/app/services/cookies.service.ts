import { Injectable } from '@angular/core';

import SftoomiCookie from '../enumerations/SftoomiCookies.enumeration';

@Injectable()
export default class CookiesService
{
    public deleteCookie(name: SftoomiCookie): void
    {
        this.setCookie(name, '', -1);
    }

    public getCookie(name: SftoomiCookie): string
    {
        const cookies: Array<string> = decodeURIComponent(document.cookie).split(';'),
            cookiesLen: number = cookies.length,
            cookieName: string = `${name}=`;

        for (let i: number = 0; i < cookiesLen; i += 1) {
            let currentCookie: string = cookies[i].replace(/^\s+/g, '');

            if (currentCookie.indexOf(cookieName) === 0) {
                return currentCookie.substring(cookieName.length, currentCookie.length);
            }
        }

        return '';
    }

    public setCookie(name: SftoomiCookie, value: string, expireDays: number, path: string = ''): void
    {
        const d: Date = new Date();
        d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);

        const expires: string = `expires=${d.toUTCString()}`,
            cpath: string = path ? `; path=${path}` : '';

        document.cookie = `${name}=${value}; ${expires}${cpath}`;
    }
}

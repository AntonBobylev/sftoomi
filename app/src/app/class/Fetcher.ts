import axios from 'axios';

import { environment } from '../../environments/environment';

import Timeout from './Timeout';
import Sftoomi from './Sftoomi';
import { DialogType } from './Dialog';

import SftoomiCookie from '../enumerations/SftoomiCookies.enumeration'

type RequestOptions = {
    url: string,
    data?: FormData,
    method?: string,
    longRequest?: boolean,
    timeout?: number,
    signal?: AbortSignal,
    success?: Function,
    failure?: Function,
    finally?: Function
};

type Request = {
    headers?: any
} & RequestOptions;

export default class Fetcher
{
    public request(options: RequestOptions): void
    {
        let request: Request = options;

        let successCallback = request.success,
            failureCallback = request.failure,
            finallyCallback = request.finally;

        request.method = request.method || 'POST';

        if (!request.timeout) {
            request.timeout = Timeout.timeout;
        }

        if (request.longRequest) {
            request.timeout = Timeout.timeoutLong;
        }

        request.headers = {
            'Content-Type': 'multipart/form-data',
            'X-Session-ID': Sftoomi.Cookies.getCookie(SftoomiCookie.SFTOOMI_SESSION)
        };

        request.url = Sftoomi.format('{0}/api{1}', [environment.baseUrl, request.url]);

        axios(request)
            .then((response): void => {
                if (typeof successCallback !== 'function') {

                    return;
                }

                try {
                    return successCallback(response, response.request, response.data);
                }  catch (e: unknown) {
                    // do not throw to catch Promise block

                    let message: string = '';
                    if (typeof e === "string") {
                        message = e.toUpperCase();
                    } else if (e instanceof Error) {
                        let stack: string = e.stack ?? '',
                            stackArray: string[] = stack.split('    '),
                            stackFormatted: string = '';

                        stackArray.forEach(function (row: string): void {
                            stackFormatted += `<div>&nbsp;&nbsp;&nbsp;&nbsp;${row}</div>`;
                        });

                        message = `<div>${e.message}</div><div>${stackFormatted}</div>`;
                    }

                    Sftoomi.Dialog.show(
                        message,
                        DialogType.ERROR,
                        (): void => {
                            if (failureCallback) {
                                failureCallback(response, response.request, response.data);
                            }
                        }
                    );
                }
            })
            .catch((error): void => {
                if (error.code === 'ERR_CANCELED') {
                    return;
                }

                let trace: string[] = error.response.data.trace.split('\n'),
                    formattedTrace: string = '';

                trace.forEach(function (row: string): void {
                    formattedTrace += `<div>${row}</div>`
                });

                let message: string = `<div style="overflow-y: auto; max-height: 300px;">
                                            <div>${error.response.data.message}</div>
                                            ${formattedTrace}
                                      </div>`;

                Sftoomi.Dialog.show(message, DialogType.ERROR);
            })
            .finally((): void => {
                if (finallyCallback) {
                    finallyCallback();
                }
            });
    }
}

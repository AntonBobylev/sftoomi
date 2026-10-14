import Timeout from './Timeout';
import Sftoomi from './Sftoomi';
import { DialogType } from './Dialog';

import SftoomiCookie from '../enumerations/SftoomiCookies.enumeration';

type RequestOptions = {
    url: string,
    data?: FormData,
    method?: string,
    timeout?: number,
    signal?: AbortSignal,
    success?: Function,
    failure?: Function,
    finally?: Function
};

type Request = {
    headers?: Record<string, string>
} & RequestOptions;

export default class Fetcher
{
    public async request(options: RequestOptions): Promise<void>
    {
        const request:         Request = options,
              successCallback: Function | undefined = request.success,
              failureCallback: Function | undefined = request.failure,
              finallyCallback: Function | undefined = request.finally,
              method:          string               = request.method || 'POST',
              timeoutMs:       number               = request.timeout || Timeout.timeout,
              headers:         Record<string, string> = {
                  'X-Session-ID': Sftoomi.Cookies.getCookie(SftoomiCookie.SFTOOMI_SESSION)
              },
              bodyToSend: BodyInit | undefined = request.data,
              url:        string = '/api' + request.url,
              controller: AbortController = new AbortController(),
              timeoutId:  number = setTimeout((): void => controller.abort(), timeoutMs);

        if (request.signal) {
            request.signal.addEventListener('abort', (): void => controller.abort());
        }

        try {
            const response: Response = await fetch(url, {
                method:  method,
                headers: headers,
                body:    bodyToSend,
                signal:  controller.signal
            });

            clearTimeout(timeoutId);

            let responseData: any = null;
            const contentType: string | null = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                responseData = await response.json().catch(() => null);
            } else {
                responseData = await response.text().catch(() => '');
            }

            const fetcherResponse = {
                data:       responseData,
                status:     response.status,
                statusText: response.statusText,
                headers:    response.headers,
                config:     request
            };

            if (!response.ok) {
                throw {
                    response: fetcherResponse
                };
            }

            if (typeof successCallback !== 'function') {
                return;
            }

            try {
                return successCallback(fetcherResponse, response, responseData);
            } catch (e: unknown) {
                let message: string = '';

                if (typeof e === 'string') {
                    message = e.toUpperCase();
                } else if (e instanceof Error) {
                    let stack:          string = e.stack ?? '',
                        stackArray:     string[] = stack.split('    '),
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
                            failureCallback(fetcherResponse, response, responseData);
                        }
                    }
                );
            }
        } catch (error: any) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
                return;
            }

            let errorData = error?.response?.data,
                traceFormatted: string = '';

            if (errorData && errorData.trace) {
                let trace: string[] = typeof errorData.trace === 'string'
                    ? errorData.trace.split('\n')
                    : [];

                trace.forEach(function (row: string): void {
                    traceFormatted += `<div>${row}</div>`;
                });
            }

            let errorMessage = errorData?.message || error?.message || 'Unknown error',
                message: string = `<div style="overflow-y: auto; max-height: 300px;">
                                       <div>${errorMessage}</div>
                                       ${traceFormatted}
                                   </div>`;

            Sftoomi.Dialog.show(message, DialogType.ERROR);
        } finally {
            if (finallyCallback) {
                finallyCallback();
            }
        }
    }
}

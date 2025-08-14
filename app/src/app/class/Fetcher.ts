import axios from 'axios';

import { environment } from '../../environments/environment';

import InformationDialogService, { InformationDialogType } from '../services/information-dialog.service';
import ServiceLocator from '../services/locator.service';

import Timeout from './Timeout';
import Sftoomi from './Sftoomi';

type RequestOptions = {
    url: string,
    module?: string,
    data?: FormData,
    params?: {}[],
    success?: Function,
    failure?: Function,
    finally?: Function,
    method?: string,
    longRequest?: boolean,
    timeout?: number,
    signal?: AbortSignal
};

type Request = {
    headers?: any
} & RequestOptions;

export default class Fetcher
{
    private readonly informationDialog: InformationDialogService;

    constructor()
    {
        this.informationDialog = ServiceLocator.injector.get(InformationDialogService);
    }

    public request(options: RequestOptions): void
    {
        let me: this = this,
            request: Request = options;

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

        if (request.data) {
            request.headers = { "Content-Type": "multipart/form-data" }
        }

        request.url = Sftoomi.format('{0}{1}', [environment.baseUrl, request.url])

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

                    me.informationDialog.show(
                        message,
                        InformationDialogType.ERROR
                    );
                }
            })
            .catch((error): void => {
                if (typeof failureCallback !== 'function' || error.code === 'ERR_CANCELED') {
                    return;
                }

                let trace: string[] = error.response.data.trace.split('#'),
                    formattedTrace: string = '';

                trace.shift();
                trace.forEach(function (row: string): void {
                    formattedTrace += `<div>#${row}</div>`
                });

                let message: string = `<div style="overflow-y: auto; max-height: 300px;">
                                            <div>${error.response.data.message}</div>
                                            ${formattedTrace}
                                      </div>`;

                me.informationDialog.show(
                    message,
                    InformationDialogType.ERROR,
                    (): void => {
                        failureCallback(error.response.data.message, formattedTrace, error.request)
                    }
                );
            })
            .finally((): void => {
                if (finallyCallback) {
                    finallyCallback();
                }
            });
    }
}

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
            failureCallback = request.failure;

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

                return successCallback(response, response.request, response.data);
            })
            .catch((error): void => {
                if (typeof failureCallback !== 'function') {
                    return;
                }

                let trace: string[] = error.response.data.trace.split('#'),
                    formattedTrace: string = '';

                trace.shift();
                trace.forEach(function (row: string): void {
                    formattedTrace += `<div>#${row}</div>`
                });

                me.informationDialog.show(
                    error.response.data.message + formattedTrace,
                    InformationDialogType.ERROR,
                    (): void => {
                        failureCallback(error.response.data.message, formattedTrace, error.request)
                    }
                );
            });
    }
}

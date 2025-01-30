import axios from 'axios';

import Timeout from './Timeout';
import Sftoomi from './Sftoomi';

type RequestOptions = {
    url: string,
    module?: string,
    formData?: {}[],
    params?: {}[],
    success?: Function,
    failure?: Function,
    method?: string,
    longRequest?: boolean,
    timeout?: number,
    signal?: AbortSignal
};

type Request = {
    data?: FormData,
} & RequestOptions;

export default class Fetcher
{
    public request(options: RequestOptions): void
    {
        let request: Request = options;

        let successCallback = request.success,
            failureCallback = request.failure;

        request.method = request.method || 'POST';

        if (!request.timeout) {
            request.timeout = Timeout.timeout;
        }

        if (request.longRequest) {
            request.timeout = Timeout.timeoutLong;
        }

        if (request.formData) {
            let data: FormData = new FormData();
            request.formData.forEach(function (row: any) {
                let value: any = row.value;

                if (value === null) {
                    value = '';
                }

                if (Sftoomi.isArray(value)) {
                    value = value.join(',');
                }

                if (Sftoomi.isDate(value)) {
                    value = Sftoomi.dateShort(value);
                }

                data.append(row.name, value);
            });

            request.data = data;
        }

        axios(request)
            .then((response): void => {
                if (response.data.success === 0) {
                    if (typeof failureCallback !== 'function') {

                        return;
                    }

                    return failureCallback(response, response.request, response.data);
                }

                if (typeof successCallback !== 'function') {

                    return;
                }

                return successCallback(response, response.request, response.data);
            })
            .catch((error): void => {
                if (typeof failureCallback !== 'function') {
                    return;
                }

                return failureCallback(error.code, error.message, error.name, error.request)
            });
    }
}

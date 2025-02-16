import axios from 'axios';

import Timeout from './Timeout';

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

export default class Fetcher
{
    public request(options: RequestOptions): void
    {
        let request: RequestOptions = options;

        let successCallback = request.success,
            failureCallback = request.failure;

        request.method = request.method || 'POST';

        if (!request.timeout) {
            request.timeout = Timeout.timeout;
        }

        if (request.longRequest) {
            request.timeout = Timeout.timeoutLong;
        }

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

                return failureCallback(error.code, error.message, error.name, error.request)
            });
    }
}

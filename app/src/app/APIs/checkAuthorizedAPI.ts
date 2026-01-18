import User from '../type/User'

type checkAuthorizedAPI = {
    success: boolean,
    error?: string,
    user: (User & {
        permissions: string[]
    })
};

export default checkAuthorizedAPI;

import User from '../type/User'

type checkAuthorizedAPI = {
    success: boolean,
    error?: string,
    user: User
};

export default checkAuthorizedAPI;

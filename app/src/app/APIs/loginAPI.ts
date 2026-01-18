import User from '../type/User'

type loginAPI = {
    success:     boolean,
    error?:      string,
    user:        (User & {
        permissions: string[]
    }),
    session_id?: string
};

export default loginAPI;

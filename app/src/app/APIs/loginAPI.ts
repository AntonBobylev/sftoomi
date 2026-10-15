import User from '../interfaces/User'

export default interface loginAPI {
    success:     boolean,
    error?:      string,
    user:        (User & {
        permissions: string[]
    }),
    session_id?: string
}

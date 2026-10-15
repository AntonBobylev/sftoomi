import User from '../interfaces/User'

export default interface checkAuthorizedAPI {
    success: boolean,
    error?: string,
    user: (User & {
        permissions: string[]
    })
}

import Permission from '../interfaces/Permission'

export default interface getGroupAPI {
    data: {
        id:   number,
        name: string,
        permissions: Permission[]
    },
    lists: {
        permissions: Permission[]
    }
}

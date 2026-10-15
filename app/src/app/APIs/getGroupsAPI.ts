import Group from '../interfaces/Group'
import Permission from '../interfaces/Permission'

export default interface getGroupsAPI {
    data: (Group & {
        permissions: Permission[]
    })[],
    total: {
        total: number
    }
}

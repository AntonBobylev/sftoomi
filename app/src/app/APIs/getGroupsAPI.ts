import Group from '../type/Group'
import Permission from '../type/Permission'

type getGroupsAPI = {
    data: (Group & {
        permissions: Permission[]
    })[],
    total: {
        total: number
    }
};

export default getGroupsAPI;

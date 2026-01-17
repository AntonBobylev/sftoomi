import Permission from '../type/Permission'

type getGroupAPI = {
    data: {
        id:   number,
        name: string,
        permissions: Permission[]
    },
    lists: {
        permissions: Permission[]
    }
};

export default getGroupAPI;

import Group from '../type/Group'

type getUsersAPI = {
    data: {
        id:          number,
        login:       string,
        first_name:  string,
        middle_name: string,
        created_at:  string,
        links: {
            user_groups: Group[]
        }
    }[],
    total: number
};

export default getUsersAPI;

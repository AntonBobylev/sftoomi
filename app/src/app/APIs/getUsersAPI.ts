import Group from '../interfaces/Group'

export default interface getUsersAPI {
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
}

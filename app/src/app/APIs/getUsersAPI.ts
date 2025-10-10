type getUsersAPI = {
    data: {
        id: number,
        login: string,
        first_name: string,
        middle_name: string,
        roles: string,
        created_at: string
    }[],
    total: number
};

export default getUsersAPI;

type getUserAPI = {
    data: {
        id: number,
        login: string,
        last_name: string | null,
        first_name: string | null
    }
};

export default getUserAPI;

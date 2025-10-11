type getUserAPI = {
    data: {
        id: number,
        login: string,
        last_name: string | null,
        first_name: string | null,
        disabled: boolean,
        reset_password: boolean,
        force_to_change_password: boolean
    }
};

export default getUserAPI;

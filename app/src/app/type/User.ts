type User = {
    id:                       number,
    disabled:                 string,
    login:                    string,
    roles:                    string[],
    force_to_change_password: string,
    first_name:               string,
    last_name:                string
};

export default User;

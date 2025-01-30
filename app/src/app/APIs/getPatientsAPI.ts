type getPatientsAPI = {
    data: {
        id: number,
        last_name: string,
        first_name: string,
        middle_name: string,
        dob: {
            date: string,
            timezone: string,
            timezone_type: number
        }
    }[]
};

export default getPatientsAPI;

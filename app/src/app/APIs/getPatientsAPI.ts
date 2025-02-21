type getPatientsAPI = {
    data: {
        id: number,
        last_name: string,
        first_name: string,
        middle_name: string,
        dob: string,
        phone: string
    }[]
};

export default getPatientsAPI;

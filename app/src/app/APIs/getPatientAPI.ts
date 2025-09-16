type getPatientAPI = {
    data: {
        id: number,
        last_name: string,
        first_name: string,
        middle_name?: string,
        dob?: string,
        phone?: string
    }
};

export default getPatientAPI;

export default interface getPatientAPI {
    data: {
        id: number,
        last_name: string,
        first_name: string,
        middle_name?: string,
        dob?: string,
        phone?: string,
        gender: 0 | 1 | null
    }
}

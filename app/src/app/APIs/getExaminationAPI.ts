import Doctor from '../interfaces/Doctor';
import Facility from '../interfaces/Facility';
import Study from '../interfaces/Study';
import Patient from '../interfaces/Patient';

export default interface getExaminationAPI {
    data: {
        id?: string,
        date?: string,
        patient_id?: string,
        facility_id?: string,
        doctor_id?: string,
        studies: number[],
        patient: Patient
    },
    lists: {
        doctors: (Doctor & {
            facilities: string
        })[]
        facilities: (Facility & {
            doctors: string
        })[],
        studies: Study[]
    }
}

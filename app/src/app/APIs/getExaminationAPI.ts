import Doctor from '../type/Doctor';
import Facility from '../type/Facility';
import Study from '../type/Study';
import Patient from '../type/Patient';

type getExaminationAPI = {
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
};

export default getExaminationAPI;

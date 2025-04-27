import Doctor from "../type/Doctor";
import Facility from '../type/Facility';
import Patient from '../type/Patient';
import Study from "../type/Study";

type getExaminationsAPI = {
    data: {
        id: number,
        date: string,
        doctor: Doctor,
        facility: Facility,
        patient: Patient,
        studies: (Study & {
            exam_id: number
        })[]
    }[],
    total: number
};

export default getExaminationsAPI;

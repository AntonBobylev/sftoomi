import Doctor from '../type/Doctor';
import Facility from '../type/Facility';
import Study from '../type/Study';

type getExaminationAPI = {
    data: {},
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

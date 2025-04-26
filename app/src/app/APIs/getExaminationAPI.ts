import Doctor from '../type/Doctor';
import Facility from '../type/Facility';

type getExaminationAPI = {
    data: {},
    lists: {
        doctors: (Doctor & {
            facilities: string
        })[]
        facilities: (Facility & {
            doctors: string
        })[]
    }
};

export default getExaminationAPI;

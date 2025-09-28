import Doctor from '../type/Doctor';
import Facility from '../type/Facility';

type getDoctorsAPI = {
    data: (Doctor & {
        doctor_facilities: Facility[]
    })[],
    total: number
};

export default getDoctorsAPI;

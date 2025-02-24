import Doctor from '../type/Doctor';
import Facility from '../type/Facility';

type getDoctorAPI = {
    data: Doctor & {
        doctor_facilities: Facility[]
    },
    lists: {
        facilities: Facility[]
    }
};

export default getDoctorAPI;

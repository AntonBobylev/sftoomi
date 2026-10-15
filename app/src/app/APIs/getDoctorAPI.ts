import Doctor from '../interfaces/Doctor';
import Facility from '../interfaces/Facility';

export default interface getDoctorAPI {
    data: Doctor & {
        doctor_facilities: Facility[]
    },
    lists: {
        facilities: Facility[]
    }
}

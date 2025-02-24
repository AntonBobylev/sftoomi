import Doctor from '../type/Doctor';
import Facility from '../type/Facility';

type getFacilityAPI = {
    data: Facility & {
        facility_doctors: Doctor[]
    },
    lists: {
        doctors: Doctor[]
    }
};

export default getFacilityAPI;

import Doctor from '../type/Doctor';
import Facility from '../type/Facility';

type getFacilitiesAPI = {
    data: (Facility & {
        facility_doctors: Doctor[]
    })[],
    total: number
};

export default getFacilitiesAPI;

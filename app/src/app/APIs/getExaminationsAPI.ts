type getExaminationsAPIRecordStudy = {
    exam_id:            number,
    exam_drafts_exists: boolean
    study_id:           number,
    study_short_name:   string,
    study_full_name:    string
}

type getExaminationsAPI = {
    data: {
        id:     number,
        date:   string,
        doctor: {
            id:          number,
            last_name:   string,
            first_name:  string,
            middle_name: string | null
        },
        facility: {
            id:          number,
            short_name:  string,
            full_name:   string
        },
        patient: {
            id:          number,
            last_name:   string,
            first_name:  string,
            middle_name: string | null,
            dob:         string | null,
            phone:       string | null
        },
        studies: getExaminationsAPIRecordStudy[]
    }[],
    total: number
};

export default getExaminationsAPI;

let usDictionary: object =  {
    add: 'Add',
    clear: 'Clear',
    dob_full: 'Date of birth',
    dob_short: 'DoB',
    edit: 'Edit',
    error: 'Error',
    filters: 'Фильтры',
    first_name: 'First name',
    full_name: 'Full name',
    id: 'ID',
    information: 'Information',
    last_name: 'Last name',
    logout: 'Logout',
    middle_name: 'Middle name',
    no_data_to_display: 'No data to display',
    not_set_tip: '(not set)',
    ok: 'OK',
    phone: 'Phone',
    refresh: 'Refresh',
    remove: 'Remove',
    save: 'Save',
    search: 'Search',
    select_all: 'Select all',
    short_name: 'Short name',
    switch_language: 'Switch language',
    warning: 'Warning',

    navigation: {
        examinations: 'Examinations',
        home: 'Home',
        login: 'Login',
        patients: 'Patients',
        administration: {
            caption: 'Administration',
            users: 'Users'
        },
        setup: {
            caption: 'Setup',
            referring_doctors: 'Referring doctors',
            referring_facilities: 'Referring facilities',
            studies: 'Studies'
        },
        mobile_view: {
            button_caption: 'MENU'
        }
    },

    views: {
        login: {
            login: 'Login',
            logon: 'Logon',
            password: 'Password'
        },
        examinations: {
            table: {
                columns: {
                    referring: {
                        caption: 'Referring',
                        doctor: 'Doctor',
                        facility: 'Facility'
                    },
                    patient: 'Patient',
                    studies: 'Studies'
                }
            },
            filters: {
                examination_date: 'Examination date',
                examination_id: 'Examination ID'
            },
            dialog: {
                add_title: 'Add examination',
                edit_title: 'Edit examination #{0}',
                no_studies_added_tip: 'You need to add at least one study to save the examination',
                blocks: {
                    common: {
                        header: 'Common',
                        date: 'Date'
                    },
                    patient: {
                        header: 'Patient',
                        patient_id: 'Patient ID'
                    },
                    referring: {
                        header: 'Referring',
                        facility: 'Facility',
                        doctor: 'Doctor'
                    },
                    studies: {
                        header: 'Studies'
                    }
                }
            }
        },
        patients: {
            dialog: {
                add_title: 'Add patient',
                edit_title: 'Edit patient #{0}',
            },
            phone_column_header_tooltip: 'Patient\'s cell phone'
        },
        home: {
            greetings_label: 'Welcome to the SFTOOMI application!'
        },
        referring_facilities: {
            table: {
                columns: {
                    doctors: {
                        caption: 'Doctors',
                        tooltip: 'Doctors assigned to the facility'
                    }
                }
            },
            dialog: {
                add_title: 'Add referring facility',
                doctors: 'Doctors',
                edit_title: 'Edit referring facility #{0}',
                width: 400
            }
        },
        referring_doctors: {
            table: {
                columns: {
                    facilities: {
                        caption: 'Facilities',
                        tooltip: 'Facilities to which the doctor is assigned'
                    }
                }
            },
            dialog: {
                add_title: 'Add referring doctor',
                edit_title: 'Edit referring doctor #{0}',
                facilities: 'Facilities',
                width: 400
            }
        },
        studies: {
            table: {
                columns: {
                    cpts: {
                        caption: 'CPTs',
                        tooltip: 'CPT codes assigned to the current study'
                    }
                }
            },
            dialog: {
                add_title: 'Add study',
                edit_title: 'Edit study #{0}',
                width: 400,
                cpts: 'CPTs'
            }
        }
    },

    fields: {
        item_selector: {
            available: 'Available',
            move_all_left: 'Move all left',
            move_all_right: 'Move all right',
            move_left: 'Move left',
            move_right: 'Move right',
            selected: 'Selected'
        },
        studies_selector: {
            caption: 'Studies',
            add_study: 'Add study',
            combo: {
                placeholder: 'Select the study'
            }
        }
    },

    validators: {
        field_required: 'This field is required',
        max_length: 'Maximum allowed length — {0}',
        max_value: 'Maximum allowed value is {0}',
        min_length: 'Minimum allowed length — {0}',
        min_value: 'Minimum allowed value is {0}',
        only_letters_allowed: 'Only letters allowed',
        phone_number_is_invalid: 'Phone number is invalid',
    },

    popup: {
        form_invalid: 'Form is invalid. Please, correct the form and try again',
        more_than_one_selected: 'More than one record selected. Please, select a single record',
        nothing_selected: 'Nothing selected'
    }
};

export default usDictionary;

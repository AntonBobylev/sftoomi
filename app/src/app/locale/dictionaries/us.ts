let usDictionary: object =  {
    add: 'Add',
    dob_full: 'Date of birth',
    edit: 'Edit',
    error: 'Error',
    first_name: 'First name',
    full_name: 'Full name',
    id: 'ID',
    information: 'Information',
    last_name: 'Last name',
    middle_name: 'Middle name',
    no_data_to_display: 'No data to display',
    ok: 'OK',
    phone: 'Phone',
    refresh: 'Refresh',
    remove: 'Remove',
    save: 'Save',
    select_all: 'Select all',
    short_name: 'Short name',
    switch_language: 'Switch language',
    warning: 'Warning',

    navigation: {
        home: 'Home',
        patients: 'Patients',
        setup: {
            caption: 'Setup',
            referring_facilities: 'Referring facilities'
        }
    },

    views: {
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
            dialog: {
                add_title: 'Add referring facility',
                edit_title: 'Edit referring facility #{0}',
                width: 400
            }
        }
    },

    validators: {
        phone_number_is_invalid: 'Phone number is invalid',
        field_required: 'This field is required',
        max_length: 'Maximum allowed length — {0}',
        min_length: 'Minimum allowed length — {0}',
        only_letters_allowed: 'Only letters allowed'
    },

    popup: {
        form_invalid: 'Form is invalid. Please, correct the form and try again',
        more_than_one_selected: 'More than one record selected. Please, select a single record',
        nothing_selected: 'Nothing selected'
    }
};

export default usDictionary;

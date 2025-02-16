let ruDictionary: object =  {
    dob: 'ДР',
    dob_full: 'Дата рождения',
    first_name: 'Имя',
    id: 'ID',
    last_name: 'Фамилия',
    middle_name: 'Отчество',

    navigation: {
        home: 'Домашняя',
        patients: 'Пациенты'
    },

    views: {
        patients: {
            dialog: {
                title: 'Редактирование пациента #{0}'
            }
        }
    },

    validators: {
        field_required: 'Это поле обязательно',
        max_length: 'Максимальная длина — {0}',
        only_letters_allowed: 'Разрешены только буквы'
    },

    home: {
        greetings_label: 'Добро пожаловать в SFTOOMI!'
    }
};

export default ruDictionary;

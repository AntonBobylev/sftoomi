let ruDictionary: object =  {
    add: 'Добавить',
    dob: 'ДР',
    dob_full: 'Дата рождения',
    edit: 'Редактировать',
    first_name: 'Имя',
    id: 'ID',
    last_name: 'Фамилия',
    middle_name: 'Отчество',
    refresh: 'Обновить',
    remove: 'Удалить',
    save: 'Сохранить',
    select_all: 'Выбрать всё',

    navigation: {
        home: 'Домашняя',
        patients: 'Пациенты'
    },

    views: {
        patients: {
            table: {
                columns: {
                    dob: {
                        width: '130px'
                    }
                }
            },
            dialog: {
                add_title: 'Добавление пациента',
                edit_title: 'Редактирование пациента #{0}'
            }
        }
    },

    validators: {
        field_required: 'Это поле обязательно',
        finish_filling_field: 'Закончите заполнение поля',
        max_length: 'Максимальная длина — {0}',
        only_letters_allowed: 'Разрешены только буквы'
    },

    home: {
        greetings_label: 'Добро пожаловать в SFTOOMI!'
    }
};

export default ruDictionary;

let ruDictionary: object =  {
    add: 'Добавить',
    dob_full: 'Дата рождения',
    edit: 'Редактировать',
    error: 'Ошибка',
    first_name: 'Имя',
    id: 'ID',
    information: 'Информация',
    last_name: 'Фамилия',
    middle_name: 'Отчество',
    no_data_to_display: 'Нет данных для отображения',
    ok: 'OK',
    phone: 'Телефон',
    refresh: 'Обновить',
    remove: 'Удалить',
    save: 'Сохранить',
    select_all: 'Выбрать всё',
    switch_language: 'Изменить язык',
    warning: 'Внимание',

    navigation: {
        home: 'Домашняя',
        patients: 'Пациенты'
    },

    views: {
        patients: {
            dialog: {
                add_title: 'Добавление пациента',
                edit_title: 'Редактирование пациента #{0}'
            },
            phone_column_header_tooltip: 'Сотовый номер пациента'
        },
        home: {
            greetings_label: 'Добро пожаловать в SFTOOMI!'
        },
    },

    validators: {
        phone_number_is_invalid: 'Неверный номер телефона',
        field_required: 'Это обязательное поле!',
        max_length: 'Максимально разрешенная длина — {0}',
        min_length: 'Минимально разрешенная длина — {0}',
        only_letters_allowed: 'Разрешены только буквы'
    },

    popup: {
        form_invalid: 'Форма заполнена неверно. Пожалуйста, исправьте форму и попробуйте снова',
        more_than_one_selected: 'Больше, чем одна запись выбрана. Пожалуйста, выберите одну запись',
        nothing_selected: 'Ничего не выбрано'
    }
};

export default ruDictionary;

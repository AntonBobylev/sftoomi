let ruDictionary: object =  {
    add: 'Добавить',
    dob: 'ДР',
    dob_full: 'Дата рождения',
    edit: 'Редактировать',
    error: 'Ошибка',
    first_name: 'Имя',
    full_name: 'Полное имя',
    id: 'ID',
    information: 'Информация',
    last_name: 'Фамилия',
    middle_name: 'Отчество',
    phone: 'Телефон',
    refresh: 'Обновить',
    remove: 'Удалить',
    save: 'Сохранить',
    select_all: 'Выбрать всё',
    short_name: 'Короткое имя',
    switch_language: 'Изменить язык',
    switch_theme: 'Поменять тему',
    warning: 'Внимание',

    navigation: {
        facilities: 'Учреждения',
        home: 'Домашняя',
        patients: 'Пациенты'
    },

    base_table: {
        items_per_page: 'строк на странице',
        rows: 'строки'
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
        },
        facilities: {
            dialog: {
                add_title: 'Добавить учреждение',
                edit_title: 'Редактирование учреждения #{0}'
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
    },

    popup: {
        form_invalid: 'Форма заполнена неверно. Пожалуйста, исправьте форму и попробуйте снова',
        more_than_one_selected: 'Больше, чем одна запись выбрана. Пожалуйста, выберите одну запись',
        nothing_selected: 'Ничего не выбрано'
    }
};

export default ruDictionary;

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function onlyLettersValidator(): ValidatorFn
{
    return (control: AbstractControl) : ValidationErrors | null =>
    {
        const valid = /^[a-zA-ZА-яёЁ\s]*$/.test(control.value);

        return valid
            ? null
            : {only_letters: {value: control.value}};
    }
}

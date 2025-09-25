import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isValidPhoneNumber } from 'libphonenumber-js/max';

import Sftoomi from '../class/Sftoomi';

export default function phoneValidator(): ValidatorFn
{
    return (control: AbstractControl): ValidationErrors | null =>
    {
        if (Sftoomi.isEmpty(control.value)) {
            return null;
        }

        const valid = isValidPhoneNumber(control.value);

        return valid
            ? null
            : {phone: {value: control.value}};
    };
}

import { TuiLoader } from '@taiga-ui/core';
import { NgComponentOutlet, NgForOf } from '@angular/common';
import {
    TuiTableCell,
    TuiTableDirective,
    TuiTableTbody,
    TuiTableTd,
    TuiTableTh,
    TuiTableThGroup,
    TuiTableTr
} from '@taiga-ui/addon-table';
import { TuiCheckbox } from '@taiga-ui/kit';
import { FormsModule } from '@angular/forms';

export default [
    TuiLoader, NgForOf, TuiTableDirective,
    TuiTableTbody, TuiTableTh, TuiTableThGroup,
    TuiTableTr, NgComponentOutlet, TuiTableTd, TuiTableCell,
    TuiCheckbox, FormsModule
];

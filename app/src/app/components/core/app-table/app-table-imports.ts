import { FormsModule } from '@angular/forms';
import { NgComponentOutlet, NgForOf, NgStyle } from '@angular/common';
import { TuiButton, TuiHint, TuiLoader, TuiTextfieldDropdownDirective } from '@taiga-ui/core';
import { TuiButtonSelect, TuiCheckbox, TuiDataListWrapperComponent, TuiPagination } from '@taiga-ui/kit';
import {
    TuiTableCaption,
    TuiTableCell,
    TuiTableDirective,
    TuiTableTbody,
    TuiTableTd,
    TuiTableTh,
    TuiTableThGroup,
    TuiTableTr
} from '@taiga-ui/addon-table';

export default [
    TuiLoader, NgForOf, TuiTableDirective,
    TuiTableTbody, TuiTableTh, TuiTableThGroup,
    TuiTableTr, NgComponentOutlet, TuiTableTd, TuiTableCell,
    TuiCheckbox, FormsModule, NgStyle, TuiHint, TuiPagination,
    TuiDataListWrapperComponent, TuiTextfieldDropdownDirective,
    TuiButton, TuiButtonSelect, TuiTableCaption
];

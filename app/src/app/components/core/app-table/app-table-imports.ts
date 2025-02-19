import { FormsModule } from '@angular/forms';
import { NgComponentOutlet, NgForOf, NgStyle } from '@angular/common';
import { TuiHint, TuiLoader } from '@taiga-ui/core';
import { TuiCheckbox, TuiPagination } from '@taiga-ui/kit';
import { TuiTableCell, TuiTableDirective, TuiTableTbody, TuiTableTd, TuiTableTh, TuiTableThGroup, TuiTableTr } from '@taiga-ui/addon-table';

export default [
    TuiLoader, NgForOf, TuiTableDirective,
    TuiTableTbody, TuiTableTh, TuiTableThGroup,
    TuiTableTr, NgComponentOutlet, TuiTableTd, TuiTableCell,
    TuiCheckbox, FormsModule, NgStyle, TuiHint, TuiPagination
];

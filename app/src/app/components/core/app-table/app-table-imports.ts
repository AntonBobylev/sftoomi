import { TuiLoader } from '@taiga-ui/core';
import { NgComponentOutlet, NgForOf } from '@angular/common';
import { TuiTableDirective, TuiTableTbody, TuiTableTh, TuiTableThGroup, TuiTableTr } from '@taiga-ui/addon-table';

export default [
    TuiLoader, NgForOf, TuiTableDirective,
    TuiTableTbody, TuiTableTh, TuiTableThGroup,
    TuiTableTr, NgComponentOutlet
];

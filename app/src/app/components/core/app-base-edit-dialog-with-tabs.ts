import { Directive } from '@angular/core';

import AppBaseEditDialog from './app-base-edit-dialog';

@Directive()
export default abstract class AppBaseEditDialogWithTabs extends AppBaseEditDialog
{
    protected activeTabIndex: number = 0;
}

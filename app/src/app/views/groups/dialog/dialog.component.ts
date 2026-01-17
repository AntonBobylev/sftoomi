import { Component, inject, Signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalFooterDirective } from 'ng-zorro-antd/modal';
import { NzButtonComponent } from 'ng-zorro-antd/button';

import AppBaseEditDialog from '../../../components/core/app-base-edit-dialog/app-base-edit-dialog';
import AppTextfieldComponent from '../../../components/core/app-textfield/app-textfield.component'
import AppItemSelectorComponent from '../../../components/core/app-item-selector/app-item-selector.component'
import { AppItemSelectorDataListRow } from '../../../components/core/app-item-selector/data-list/data-list.component'

import getGroupAPI from '../../../APIs/getGroupAPI'

import Permission from '../../../type/Permission'

export type GroupEditDialogData = {
    id?: number
};

@Component({
    selector: 'group-edit-dialog',
    templateUrl: './dialog.component.html',
    imports: [
        FormsModule, ReactiveFormsModule,
        NzButtonComponent, NzModalFooterDirective,
        AppTextfieldComponent, AppItemSelectorComponent
    ],
    styleUrl: './dialog.component.less'
})

export default class GroupEditDialogComponent extends AppBaseEditDialog
{
    protected permissionsCtrl: Signal<AppItemSelectorComponent | undefined> = viewChild('permissionsCtrl');

    protected override readonly data: GroupEditDialogData = inject(NZ_MODAL_DATA);

    protected override readonly fetchExtraRequestOnLoad: boolean = true;

    protected override readonly loadUrl: string = '/getGroup';
    protected override readonly saveUrl: string = '/saveGroup';

    protected override readonly width: number | string | undefined = this.Sftoomi.Translator.translate('views.groups.dialog.width');

    protected readonly form: FormGroup = new FormGroup({
        group_name: new FormControl<string | null>(null, [Validators.required])
    });

    protected afterLoad(data: getGroupAPI): void
    {
        this.form.get('group_name')?.setValue(data.data.name);

        let availablePermissionsList: Permission[] = data.lists.permissions;
        data.data.permissions.forEach((groupPermission: Permission): void => {
            availablePermissionsList = availablePermissionsList.filter((permission: Permission): boolean => {
                return permission.id !== groupPermission.id;
            });
        })
        this.permissionsCtrl()?.setData(
            this.convertPermissionsToItemSelectorRow(availablePermissionsList),
            this.convertPermissionsToItemSelectorRow(data.data.permissions)
        );
    }

    protected override getAdditionalDataOnSave(data: FormData): FormData
    {
        return data;
    }

    protected override isPreValid(): boolean
    {
        if (this.Sftoomi.isEmpty(this.permissionsCtrl()?.getRightListData())) {
            return false;
        }

        return true;
    }

    private convertPermissionsToItemSelectorRow(permissions: Permission[]): AppItemSelectorDataListRow[]
    {
        return permissions.map(function (row: Permission): AppItemSelectorDataListRow {
            return {
                name:    row.name,
                value:   row.id.toString(),
                tooltip: row.description
            };
        });
    }
}

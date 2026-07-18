import { Directive, input, InputSignal } from '@angular/core'

import Sftoomi from '../../../class/Sftoomi';

@Directive()
export default abstract class AppTableCommonColumn<DataType, TableType>
{
    public readonly rowData: InputSignal<DataType> = input.required();
    public readonly table: InputSignal<TableType> = input.required();

    protected readonly Sftoomi: typeof Sftoomi = Sftoomi;
}

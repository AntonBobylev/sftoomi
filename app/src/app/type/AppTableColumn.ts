import AppTableColumnStyles from './AppTableColumnStyles';

type AppTableColumn = {
    name: string,
    caption: string,
    resizable?: boolean,
    valueRenderer?: Function,
    headerStyles?: AppTableColumnStyles,
    styles?: AppTableColumnStyles
};

export default AppTableColumn;

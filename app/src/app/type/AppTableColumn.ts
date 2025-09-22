type AppTableColumn = {
    name: string,
    resizable?: boolean,
    valueRenderer?: Function,
    header: {
        caption: string,
        widthPx?: string,
        tooltipRenderer?: Function,
        extraStyles?: object
    },
    dataCell?: {
        tooltipRenderer?: Function,
        extraStyles?: object
    }
};

export default AppTableColumn;

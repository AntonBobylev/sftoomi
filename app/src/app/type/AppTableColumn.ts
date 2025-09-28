type AppTableColumn = {
    name: string,
    resizable?: boolean,
    valueRenderer?: Function,
    rawHtml?: boolean,
    width?: string,
    header: {
        caption: string,
        tooltipRenderer?: Function,
        extraStyles?: object
    },
    dataCell?: {
        tooltipRenderer?: Function,
        extraStyles?: object
    }
};

export default AppTableColumn;

type AppTableColumn = {
    name: string,
    resizable?: boolean,
    valueRenderer?: Function,
    header: {
        caption: string,
        widthPx?: string,
        extraStyles?: object
    }
};

export default AppTableColumn;

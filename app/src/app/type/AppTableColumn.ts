type AppTableColumn = {
    name: string,
    resizable?: boolean,
    valueRenderer?: Function,
    header: {
        caption: string,
        widthPx?: string
    }
};

export default AppTableColumn;

type getDraftViewerData = {
    data: {
        last_edited_draft_template_id: number | null
    },
    lists: {
        templates: {
            id:      number,
            name:    string
        }[]
    }
};

export default getDraftViewerData;

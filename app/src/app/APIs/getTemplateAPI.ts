import Study from '../type/Study';

type getTemplateAPI = {
    data: {
        id?: number,
        name?: string,
        allowed_studies: number[]
    },
    lists: {
        studies: Study[]
    }
};

export default getTemplateAPI;

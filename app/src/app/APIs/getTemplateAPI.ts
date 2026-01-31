import Study from '../type/Study';
import GenericTemplate from '../type/GenericTemplate'

type getTemplateAPI = {
    data: {
        id?:             number,
        name?:           string,
        content?:        string,
        allowed_studies: number[]
    },
    lists: {
        studies:           Study[],
        generic_templates: GenericTemplate[]
    }
};

export default getTemplateAPI;

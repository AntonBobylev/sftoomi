import Study from '../interfaces/Study';
import GenericTemplate from '../interfaces/GenericTemplate'

export default interface getTemplateAPI {
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
}

import {QueryLanguage, Model, Utils, EFieldType} from "@diaspora/diaspora";
import { Raw } from "@diaspora/diaspora/dist/types/types/modelDescription";


export const product = {
    name: EFieldType.STRING,
    attributes: {
        type: EFieldType.ARRAY,
        of: EFieldType.INTEGER,
    },
    images: {
        type: EFieldType.ARRAY,
        of: EFieldType.STRING,
    },
} as Raw.IAttributesDescription

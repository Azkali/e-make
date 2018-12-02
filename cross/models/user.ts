import { EFieldType } from "@diaspora/diaspora";
import { Raw } from "@diaspora/diaspora/dist/types/types/modelDescription";


export const user: Raw.IAttributesDescription = {
    email: EFieldType.STRING,
    password: EFieldType.STRING,
    facebookId: EFieldType.STRING,
    facebooktoken: EFieldType.STRING,
};

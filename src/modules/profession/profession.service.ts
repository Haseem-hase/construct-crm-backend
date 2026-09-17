import * as professionRepository from "./profession.repository";

export const getProfessions = async () => {
    return await professionRepository.getProfessions();
};

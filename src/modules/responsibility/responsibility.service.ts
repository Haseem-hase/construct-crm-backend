import * as responsibilityRepository from "./responsibility.repository";

export const getResponsibilities = async () => {
    return await responsibilityRepository.getActiveResponsibilities();
};

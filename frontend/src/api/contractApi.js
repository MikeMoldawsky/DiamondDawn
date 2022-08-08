export const getMinePriceApi = async (contract) => {
  return await contract.MINING_PRICE();
};

export const getSystemStageApi = async (contract) => {
  return await contract.systemStage();
};

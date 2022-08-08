export const fetchMinePrice = async (contract) => {
  return await contract.MINING_PRICE();
};

export const fetchSystemStage = async (contract) => {
  return await contract.stage();
};
export const completeCurrentStageAndRevealNextStage = async (contract) => {
  const tx = await contract.completeCurrentStageAndRevealNextStage();
  const receipt = await tx.wait();
  return receipt.transactionHash
};

export const pause = async (contract) => {
  const tx = await contract.pause();
  const receipt = await tx.wait();
  return receipt.transactionHash
};

export const unpause = async (contract) => {
  const tx = await contract.unpause();
  const receipt = await tx.wait();
  return receipt.transactionHash
};
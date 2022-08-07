// ADMIN CONTROL API
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

// ART URLS API

// DIAMONDS API
const prepareDiamondForPopulate = diamond => ({
  points: parseInt(
    (parseFloat(diamond.carat.$numberDecimal) * 100).toString()
  ),
  clarity: diamond.clarity,
  color: diamond.color,
  cut: diamond.cut,
  depth: diamond.depth.$numberDecimal,
  fluorescence: diamond.fluorescence,
  length: diamond.length.$numberDecimal,
  polish: diamond.polish,
  reportDate: parseInt(diamond.reportDate),
  reportNumber: parseInt(diamond.reportNumber),
  shape: diamond.shape,
  symmetry: diamond.symmetry,
  width: diamond.width.$numberDecimal,
})

export const populateDiamonds = async (contract, diamonds) => {
  const processedDiamonds = diamonds.map(prepareDiamondForPopulate)

  console.log("PUSHING DIAMONDS TO MINE CONTRACT", { diamonds, processedDiamonds });

  const tx = await contract.populateDiamonds(processedDiamonds);
  const receipt = await tx.wait();
  return receipt.transactionHash
}
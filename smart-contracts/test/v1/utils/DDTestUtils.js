async function completeAndSetStage(dd, stage) {
  await dd.completeStage(await dd.stage());
  await dd.setStage(stage);
}

module.exports = {
  completeAndSetStage,
};

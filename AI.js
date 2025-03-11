class AI {
  constructor() {
    if (this.nextGen === undefined) {
      // or maybe test typeof this.method === "function"
      throw new TypeError("Must override method");
    }
  }
  createPlayer(weights) {
    let newModel = this.getBaseModel();
    newModel.setWeights(weights);
    return this.createPlayerwithModel(newModel);
  }

  createPlayerwithModel(model) {
    return new Player(
      startx,
      starty,
      10,
      10,
      { x: 1, y: 0 },
      0.2,
      1,
      { x: -1, y: -1 },
      false,
      0,
      1000,
      model
    );
  }
  getBaseModel() {
    //copy
    let model = tf.sequential({
      layers: [
        tf.layers.dense({
          inputShape: [6],
          units: 6,
          activation: "relu",
          kernelInitializer: "randomNormal",
        }),
        tf.layers.dense({
          units: MOVES.length,
          activation: "relu",
          kernelInitializer: "randomNormal",
        }),
      ],
    });
    return model;
  }
}

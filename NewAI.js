class NewAI extends AI {
  nextGen(players) {
    let player = players[0];
    let trainingData = player.moves;
    const model = player.model
    // Generate dummy data.
    let data = player.inputs;
    let labels = player.moves;
    if(player.reward == 0){
        for(let i = 0;i<labels.length;i++){
            labels[i] = [1,0,0]
        }
    }
    const dataTensor = tf.tensor(data);
    const labelsTensor = tf.tensor(labels);
    

    function onBatchEnd(batch, logs) {
      console.log("Accuracy", logs.acc);
    }

    // Train for 5 epochs with batch size of 32.
    model
      .fit(dataTensor, labelsTensor, {
        epochs: 5,
        batchSize: 32,
        callbacks: { onBatchEnd },
      })
      .then((info) => {
        console.log("Final accuracy", info.history.acc);
      });
  }
}

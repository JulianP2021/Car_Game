class OldAI_1 extends AI {
  nextGen(players) {
    tf.tidy(() => {
      let newPlayers = [];
      let playerToLookAt = players.sort((a, b) => b.score - a.score)[0];
      let bestModel = playerToLookAt.copyModel();
      console.log(playerToLookAt);
      for (let i = 0; i < players.length - 1; i++) {
        //newPlayers.push(mutate(playerToLookAt));
        newPlayers.push(this.createPlayerwithModel(mutate2(playerToLookAt.model)));
      }
      newPlayers.push(this.createPlayerwithModel(bestModel));
      players = newPlayers;
      console.log(players);
      return players;
    });
  }

  mutate(player) {
    let weightsCopy = player.model.getWeights();
    let mutatedWeights = [];
    for (let i = 0; i < weightsCopy.length; i++) {
      let tensor = weightsCopy[i];
      let shape = weightsCopy[i].shape;
      let values = tensor.dataSync().slice();
      for (let i = 0; i < values.length; i++) {
        if (Math.random() < 0.1) {
          let w = values[i];
          values[i] = w + (Math.random() - 0.5) * 0.2;
        }
      }
      let newTensor = tf.tensor(values, shape);
      mutatedWeights[i] = newTensor;
    }
    let player2 = this.createPlayer(mutatedWeights);
    return player2;
  }

  mutate2(model) {
    let randomNumber = Math.random();
    /*if (randomNumber < 0.3) {
            model = removeoneUnit(model);
        } else if (randomNumber > 0.3) {
            model = addoneUnit(model);
        }
    */ let weightsCopy = [];
    model.weights.forEach((w) => {
      //console.log(w.val.dataSync());
      const shape = w.val.shape;
      const mutation = tf.randomNormal(shape, 0);
      weightsCopy.push(w.val.add(mutation));
      //console.log(weightsCopy[weightsCopy.length-1].dataSync());
    });
    let newModel = this.getBaseModel();
    newModel.setWeights(weightsCopy);
    /*
        for(let i = 0;i<model.getWeights().length;i++){
            console.log(model.getWeights()[i].dataSync(), newModel.getWeights()[i].dataSync());
        }
        */
    return newModel;
  }

  removeoneUnit(model) {
    return model;
  }

  addoneUnit(model) {
    return model;
  }
}

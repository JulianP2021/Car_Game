class QTable extends AI {
  tracksize = 100;
  predict(players) {
    let castedInput = this.castInputs(players[0].inputs, this.tracksize);
    let row =
      players[0].qTable[castedInput.marginSides][castedInput.marginFrontSides][
        castedInput.marginFront
      ];
    let prediction = row.indexOf(Math.max(...row));
    if(row[prediction] == -1){
      return Math.floor(Math.random()*3);
    }
    return prediction;
  }
  nextGen(players) {
    let player = players[0];
    let castedInput = this.castInputs(player.in);
    for (let i = moves.length - 1; i >= 0; i++) {
      c;
      if (i < moves.length - 1 - 10) {
        let reward = player.reward / moves.length;
        player.qTable[castedInput.marginSides][castedInput.marginFrontSides][
          castedInput.marginFront
        ][moves[i]] += reward;
      } else {
        player.qTable[castedInput.marginSides][
          castedInput.marginFrontSides
        ][castedInput.marginFront][moves[i]] = -1;
      }
    }

    players[0].reset();
    return [players[0]];
  }

  castInputs(inputs) {
    //qTable: 0 links margin größer,1 gleich groß, 2 rechts größer, ..., 0 Abstand kleiner 2*tracksize, 1 Abstand größer
    let marginSides = inputs[1] > inputs[5] ? 0 : 2;
    if (inputs[1] >= inputs[5]) {
      marginSides = 1;
    }
    let marginFrontSides = inputs[2] > inputs[4] ? 0 : 2;
    if (inputs[2] >= inputs[4]) {
      marginFrontSides = 1;
    }
    let marginFront = inputs[3] > this.tracksize ? 1 : 0;
    return {
      marginSides: marginSides,
      marginFrontSides: marginFrontSides,
      marginFront: marginFront,
    };
  }
}

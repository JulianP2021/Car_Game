class OldAI_2 extends AI {
    nextGen(players) {
        tf.tidy(() => {
          console.log(players);
          // sort the population based on their score
          players = players.sort((a, b) => b.score - a.score);
          let length = players.length;
      
          // Select the top half of the population for breeding
          players = [...new Map(players.map((p) => [p.score, p])).values()];
          players = players.sort((a, b) => b.score - a.score);
          let bestModel = players[0].copyModel();
          const breedingPopulation = players.slice(
            0,
            Math.ceil((players.length / 10) * 3)
          );
          console.log(breedingPopulation, players);
          // Perform crossover to generate new offspring
          const offspring = [];
          while (offspring.length < length - breedingPopulation.length) {
            const parent1 =
              breedingPopulation[
                Math.floor(Math.random() * breedingPopulation.length)
              ];
            const parent2 =
              breedingPopulation[
                Math.floor(Math.random() * breedingPopulation.length)
              ];
            const child = this.createPlayerwithModel(
                this.crossover(parent1.model, parent2.model)
            );
            offspring.push(child);
          }
          let newPopulation = breedingPopulation.concat(offspring);
          players = [];
          players.push(this.createPlayerwithModel(bestModel));
          for (let i = 0; i < newPopulation.length - 1; i++) {
            players.push(this.createPlayerwithModel(mutate2(newPopulation[i].model)));
          }
        });
      }
      
    crossover(parent1, parent2) {
        // Create a new model with the same architecture as the parents
        const child = this.getBaseModel();
      
        // perform crossover on the weights
        for (let i = 0; i < child.layers.length; i++) {
          const w1 = parent1.getWeights(i);
          const w2 = parent2.getWeights(i);
          const newWeights = [];
          for (let j = 0; j < w1.length; j++) {
            // you can use any crossover method you want here, I'll use the single point crossover
            const shape = w1[j].shape;
            const point = Math.floor(Math.random() * shape[0]);
            const w1_part1 = w1[j].slice(0, point);
            const w2_part2 = w2[j].slice(point, w2[j].length);
            const newWeight = w1_part1.concat(w2_part2, 0);
            newWeights.push(newWeight);
          }
          child.setWeights(newWeights);
        }
        return child;
      }
}
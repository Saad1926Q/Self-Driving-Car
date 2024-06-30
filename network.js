class NeuralNetwork{
    //Neuron count means an array having number of neurons in each layer
    constructor(neuronCounts){
        this.levels=[];
        for (let i = 0; i < neuronCounts.length-1; i++) {
            this.levels.push(
                new Level(neuronCounts[i],neuronCounts[i+1])
            )
        }
    }

    static mutate(network,amount=1){
        network.levels.forEach(level => {
            for (let i = 0; i < level.biases.length; i++) {
                level.biases[i]=lerp(
                    level.biases[i],
                    Math.random()*2-1,
                    amount
                )
            }

            for (let i = 0; i < level.weights.length; i++) {
                for (let j = 0; j < level.weights[i].length; j++) {
                    level.weights[i][j]=lerp(
                        level.weights[i][j],
                        Math.random()*2-1,
                        amount
                    )
                }
                
            }
        });
    }

    static feedForward(givenInputs,network){

        //Here we are basically putting the output from the previous level as input in the next level

        let outputs = Level.feedForward(
            givenInputs,
            network.levels[0]
        )


        for (let i = 0; i < network.levels.length; i++) {
            outputs=Level.feedForward(
                outputs,network.levels[i]
            )
            
        }

        return outputs;
    }
}

class Level{
    //Each level has a layer of input neurons and a layer of output neurons
    constructor(inputCount,outputCount) {
        this.inputs=new Array(inputCount);
        this.outputs=new Array(outputCount)
        //Each output neuron has a bias ie a value upon which it will fire
        this.biases=new Array(outputCount)

        this.weights=[];
        for (let i = 0; i < inputCount; i++) {
            //For Each input node we are going to have output count number of connections
            this.weights[i]=new Array(outputCount)
        }

        Level.#randomize(this)
    }

    static #randomize(level){
        for (let i = 0; i < level.inputs.length; i++) {
            for (let j = 0; j < level.outputs.length; j++) {
                level.weights[i][j]=Math.random()*2-1  // A value between -1 and 1
            }
            
        }

        for (let i = 0; i < level.outputs.length; i++) {
            level.biases[i]=Math.random()*2-1  // A value between -1 and 1
            
        }
    }


    //Feedforward Algorithm

    static feedForward(givenInputs,level){
        for (let i = 0; i < level.inputs.length; i++) {
            level.inputs[i]=givenInputs[i]
        }

        //We are going to calculate a kind of sum between the value of inputs and the weights

        for (let i = 0; i < level.outputs.length; i++) {
            let sum=0;
            for (let j = 0; j < level.inputs.length; j++) {
                sum+=level.inputs[j]*level.weights[j][i] // Product between the j th input and the weight between the jth input and the ith output
            }

            if(sum>level.biases[i]){
                level.outputs[i]=1
            }else{
                level.outputs[i]=0
            }
        }

        return level.outputs
    }

}
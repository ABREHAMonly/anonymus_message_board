const toxicity = require('@tensorflow-models/toxicity');
require('@tensorflow/tfjs'); // Use the browser-compatible version

let model;
const loadModel = async () => {
    if (!model) {
        model = await toxicity.load(0.9);
    }
    return model;
};

const checkToxicity = async (message) => {
    try {
        const model = await loadModel();
        const predictions = await model.classify([message]);
        return predictions.some(pred => pred.results[0].match);
    } catch (error) {
        console.error("Error checking toxicity:", error);
        return false;
    }
};

module.exports= checkToxicity;
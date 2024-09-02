const formidable = require('formidable');
const fs = require('fs');
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.handler = async (event) => {
    const formData = new formidable.IncomingForm({ multiples: true });

    return new Promise((resolve, reject) => {
        formData.parse(event, async (err, fields, files) => {
            if (err) {
                return resolve({
                    statusCode: 500,
                    body: JSON.stringify({ error: 'Error parsing the files' }),
                });
            }

            const results = [];
            const images = files.images instanceof Array ? files.images : [files.images];

            for (let image of images) {
                try {
                    // Process each image to get car specs (using your existing logic)
                    const carSpecs = await getCarSpecs(image); // Replace with your actual logic
                    results.push(carSpecs);
                } catch (error) {
                    console.error('Error processing image:', error);
                    results.push({ error: 'Failed to process image' });
                }
            }

            resolve({
                statusCode: 200,
                body: JSON.stringify({ specs: results }),
            });
        });
    });
};

async function getCarSpecs(image) {
    // Example processing logic for getting car specs
    // In a real scenario, you'd likely be sending the image to an API for analysis
    // Replace the following with actual logic to analyze the image and get specs

    // Simulate API call
    const prompt = `Provide a detailed list of specifications for a car in the image.`;

    const gptResponse = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 500,
        temperature: 0.5,
    });

    const specsText = gptResponse.data.choices[0].text.trim();

    try {
        const specs = JSON.parse(specsText); // Assuming the response is JSON format
        return specs;
    } catch (err) {
        // Fallback if JSON parsing fails
        const specs = {};
        specsText.split('\n').forEach(line => {
            const [key, value] = line.split(':').map(s => s.trim());
            if (key && value) {
                specs[key] = value;
            }
        });
        return specs;
    }
}

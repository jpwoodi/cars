exports.handler = async (event) => {
    const formData = new formidable.IncomingForm({ multiples: true });

    return new Promise((resolve, reject) => {
        formData.parse(event, async (err, fields, files) => {
            if (err) {
                return reject({
                    statusCode: 500,
                    body: JSON.stringify({ error: 'Error parsing the files' }),
                });
            }

            const results = [];
            const images = files.images instanceof Array ? files.images : [files.images];

            for (let image of images) {
                // Process each image to get car specs (using your existing logic)
                const carSpecs = await getCarSpecs(image); // Replace with your actual logic
                results.push(carSpecs);
            }

            resolve({
                statusCode: 200,
                body: JSON.stringify({ specs: results }),
            });
        });
    });
};

async function getCarSpecs(image) {
    // Your existing logic to get specs from the image
    return { make: 'Toyota', model: 'Camry', year: '2021' }; // Replace with actual data
}

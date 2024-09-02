const fetch = require('node-fetch');

exports.handler = async (event) => {
    const formData = JSON.parse(event.body);
    const image = formData.image; // Assuming you encode the image in base64 and send it in the request

    // Use OpenAI API to analyze the car image and retrieve specs
    const response = await fetch('https://api.openai.com/v1/images', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            image: image,
        }),
    });

    const data = await response.json();

    if (response.ok) {
        return {
            statusCode: 200,
            body: JSON.stringify({ specs: data.choices[0].text }),
        };
    } else {
        return {
            statusCode: response.status,
            body: JSON.stringify({ error: data.error.message }),
        };
    }
};

const express = require('express');
const fetch = require('node-fetch'); // Only if using Node.js
const app = express();
const cors = require('cors');

app.use(express.json()); // To parse JSON request bodies

// Set up CORS to allow requests from your specific domain
const corsOptions = {
    origin: ['https://www.mediahawk.ai', 'http://localhost:3000'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));


app.post('/api/generate-ideas', async (req, res) => {
    try {
        // Extracting data from the request body
        const { businessType, currentChallenges, goalWithAI } = req.body;

        // Construct the prompt for the OpenAI API
        const prompt = `In about 100 words, generate ideas on how AI can help in business.\nBusiness Type: ${businessType}\nChallenges: ${currentChallenges}\nGoals with AI: ${goalWithAI}`;

        // Define the request payload for OpenAI API, including max_tokens
        const openaiRequestPayload = {
            model: "gpt-3.5-turbo",
            messages: [{"role": "user", "content": prompt}],
            temperature: 0.7,
            max_tokens: 150 // Set the max_tokens value as needed
        };

        
        // Make the API call to OpenAI
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // Use an environment variable for the API key
            },
            body: JSON.stringify(openaiRequestPayload)
        });

        // Check if the response is not okay
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error response from OpenAI:", errorText);
            return res.status(500).send(`Error from OpenAI API: ${errorText}`);
        }

        // Parse the response data
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/api/generate-hangman', async (req, res) => {
    try {
        // Extracting data from the request body
        const { wordGenre } = req.body;

        // Construct the prompt for the OpenAI API
        const prompt = `In 1 word, generate a word to play hangman with that is 8 letters long and relates to the following: ${wordGenre}`;

        // Define the request payload for OpenAI API, including max_tokens
        const openaiRequestPayload = {
            model: "gpt-3.5-turbo",
            messages: [{"role": "user", "content": prompt}],
            temperature: 0.7,
            max_tokens: 15 // Set the max_tokens value as needed
        };

        
        // Make the API call to OpenAI
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // Use an environment variable for the API key
            },
            body: JSON.stringify(openaiRequestPayload)
        });

        // Check if the response is not okay
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error response from OpenAI:", errorText);
            return res.status(500).send(`Error from OpenAI API: ${errorText}`);
        }

        // Parse the response data
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

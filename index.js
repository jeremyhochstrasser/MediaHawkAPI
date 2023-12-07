const express = require('express');
const fetch = require('node-fetch'); // Make sure node-fetch is installed
const app = express();

app.use(express.json()); // For parsing application/json

app.post('/api/generate-ideas', async (req, res) => {
    try {
        // Extracting data from the request body
        // Assuming the format is something like:
        // {
        //     businessType: '...',
        //     currentChallenges: '...',
        //     goalWithAI: '...'
        // }
        const { businessType, currentChallenges, goalWithAI } = req.body;

        // Construct the prompt for the OpenAI API
        const prompt = `Generate ideas on how AI can help in business.\nBusiness Type: ${businessType}\nChallenges: ${currentChallenges}\nGoals with AI: ${goalWithAI}`;

        const openaiRequestPayload = {
            model: "gpt-3.5-turbo",
            messages: [{"role": "user", "content": prompt}],
            temperature: 0.7
        };

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // Use an environment variable
            },
            body: JSON.stringify(openaiRequestPayload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error response from OpenAI:", errorText);
            return res.status(500).send(`Error from OpenAI API: ${errorText}`);
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

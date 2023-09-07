const express = require('express');
const axios = require('axios');
const cors = require('cors'); 

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()); // Use the cors middleware

// Define your proxy route
app.post('/proxy-authentication', async (req, res) => {
    try {
        const response = await fetch('https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body),
        });

        if (!response.ok) {
            // Handle non-successful response (e.g., log error details)
            console.error('External API returned an error:', response.status, response.statusText);
            res.status(500).json({ error: 'Authentication failed' });
            return;
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        // Handle any other errors (e.g., network issues)
        console.error('Error during authentication:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

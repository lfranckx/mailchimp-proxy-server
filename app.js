const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const request = require('request');
const jsonParser = express.json();
require('dotenv').config();

const PORT = process.env.PORT;
const apiKey = process.env.API_KEY;
const listId = process.env.LIST_ID;
const myDc = process.env.MY_DC;

const app = express();
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello Express!');
});

app.post('/', jsonParser, (req, res, next) => {
    const { email_address } = req.body

    if (!email_address) {
        return res.status(400).json({
            error: `Missing email in request body`
        })
    }

    const data = {
        members: [
            {
                email_address,
                status: 'subscribed'
            }
        ]
    }

    const payload = JSON.stringify(data);

    const options = {
        url: `https://${myDc}.api.mailchimp.com/3.0/lists/${listId}`,
        method: 'POST',
        headers: {
            Authorization: `auth ${apiKey}`
        },
        body: payload
    }

    request(options, (err, response, body) => {
        if (err) {
            res.status(500).json(err)
        } else {
            if (response.statusCode === 200) {
                res.status(200).json(body)
            }
        }
    })
})

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});
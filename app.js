const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const request = require('request');
const jsonParser = express.json();
require('dotenv').config();

const PORT = process.env.PORT;
const ollinApiKey = process.env.OLLIN_API_KEY;
const ollinDc = process.env.OLLIN_DC;
const ollinListId = process.env.OLLIN_LIST_ID;
const bsharpApiKey = process.env.BSHARP_API_KEY;
const bsharpDc = process.env.BSHARP_DC;
const bsharpListId = process.env.BSHARP_LIST_ID;


const app = express();
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello Express!');
});

app.post('/', jsonParser, (req, res, next) => {
    const { id, email_address, name } = req.body
    console.log(req.body);

    if (id === 'ollin') {
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
            url: `https://${ollinDc}.api.mailchimp.com/3.0/lists/${ollinListId}`,
            method: 'POST',
            headers: {
                Authorization: `auth ${ollinApiKey}`
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
    
                console.log('response', response);
                console.log('body', body);
            }
        })
    }

    if (id=== 'bsharp') {
        if (!email_address) {
            return res.status(400).json({
                error: `Missing email in request body`
            })
        }

        if (!name) {
            return res.status(400).json({
                error: `Missing name in request body`
            })
        }

        const data = {
            members: [
                {
                    email_address,
                    status: 'subscribed',
                    merge_fields: {
                        FNAME: name
                    }
                }
            ]
        }

        const payload = JSON.stringify(data);

        const options = {
            url: `https://${bsharpDc}.api.mailchimp.com/3.0/lists/${bsharpListId}`,
            method: 'POST',
            headers: {
                Authorization: `auth ${bsharpApiKey}`
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

                console.log('response', response);
                console.log('body', body);
            }
        })
    }
})

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});
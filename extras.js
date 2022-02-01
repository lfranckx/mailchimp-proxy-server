console.log('req body', req.body);
console.log('my dc', myDc);
console.log('api key', apiKey);
console.log('list id', listId);
console.log('payload', payload);

axios.post(`https://${myDc}.api.mailchimp.com/3.0/lists/${listId}/members`, payload,
    {
        headers: {
            Authorization: `Basic ${apiKey}`
        }
    }
);

return res.status(200).json(data)
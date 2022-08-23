# patreon-webhook-signature
Simple way to verify webhook requests from Patreon using your webhook secret.

### Install
`npm i patreon-webhook-signature`

### Example (Express)
Explanation: For the hashes to match the body of the request must be exactly how Patreon intended it after being sent to your endpoint. Even converting it to JSON will change enough data for it to mismatch the hash. This means that the body of the request must be as raw and untouched as possible resulting in the expected hash. You may have to fiddle around with your codebase in order to get this to work properly, so use the below example as a form of guideance.
```js
const express = require('express');
const bodyParser = require('body-parser');
const pws = require('patreon-webhook-signature');

const app = express();

// *REQUIRED*
// req.body MUST be raw for the patreon webhook endpoint
// otherwise <PWS>.verify always returns false.
// The body must be raw as it must be exactly how Patreon
// sent the original webhook request, otherwise if even
// a single byte is different the hash will be vastly different.
// *However*, this turns req.body into a buffer - see comment below.
app.use('/api/v1/patreon', bodyParser.raw({ type: 'application/json' })); // This must also be above defining routes or parsing with json etc.
app.use(bodyParser.json());

app.post('/api/v1/patreon', async (req, res) => {
    const verified = pws.verify(
        process.env.PATREON_SECRET, 
        req.headers['x-patreon-signature'],
        req.body
    );
    
    if (!verified || req.headers['x-patreon-signature'] == null) {
        return res.status(401).send('Invalid Authentication.');
    }

    // As req.body is now a Buffer, you must use this
    // if you require the body parameters as if it
    // was a normal JSON request.
    const body = pws.body(req.body);

    console.log(`(Patreon) ${body.included[0].attributes.full_name} just pledged.`);
});
```
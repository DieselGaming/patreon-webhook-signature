const crypto = require('crypto');

/**
 * Hash your request body using your Patreon secret.
 * @param {string} secret The webhook secret provided in your portal.
 * @param {any} body The body of the webhook request.
 * @returns {string}
 */
module.exports.hash = (secret, body) => {
    if (!secret) return new Error('Secret cannot be empty!');
    if (!body) return new Error('Body cannot be empty!');
    return crypto.createHmac('md5', secret).update(body).digest('hex');
};

/**
 * Verify a request body against your Patreon secret to determine if it is official.
 * @param {string} secret The webhook secret provided in your portal.
 * @param {string} signature The x-patreon-signature header.
 * @param {any} body The body of the webhook request.
 * @returns {boolean}
 */
module.exports.verify = (secret, signature, body) => {
    if (!secret) return new Error('Secret cannot be empty!');
    if (!signature) return new Error('Signature cannot be empty!');
    if (!body) return new Error('Body cannot be empty!');
    return signature === this.hash(secret, body);
};

/**
 * Convert the RAW body into JSON to be used like normal.
 * @param {any} body The body of the webhook request.
 * @returns {any}
 */
module.exports.body = (body) => {
    if (!body) return new Error('Body cannot be empty!');
    return JSON.parse(body.toString());
};
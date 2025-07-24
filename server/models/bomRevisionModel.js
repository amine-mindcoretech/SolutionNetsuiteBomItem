// models/bomRevisionModel.js

const axios = require('axios');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');
const config = require('../config/netsuiteConfig');

const oauth = OAuth({
    consumer: {
        key: config.consumerKey,
        secret: config.consumerSecret
    },
    signature_method: 'HMAC-SHA256',
    hash_function(base_string, key) {
        return crypto.createHmac('sha256', key).update(base_string).digest('base64');
    }
});

async function createBomRevision(bomRevisionData) {
    const request_data = {
        url: `${config.bomRevisionUrl}`,
        method: 'POST'
    };

    const token = {
        key: config.accessToken,
        secret: config.tokenSecret
    };

    const headers = oauth.toHeader(oauth.authorize(request_data, token));
    headers['Content-Type'] = 'application/json';
    headers['Authorization'] = `${headers['Authorization']}, realm="${config.realm}"`;

    console.log('Sending BOM Revision data:', JSON.stringify(bomRevisionData, null, 2)); // Debug log

    try {
        const response = await axios.post(request_data.url, bomRevisionData, { headers });
        console.log('Response:', response.data); // Debug log
        return response.data;
    } catch (error) {
        console.error('Error creating BOM Revision:', error.response ? error.response.data : error.message);
        throw error;
    }
}

module.exports = { createBomRevision };

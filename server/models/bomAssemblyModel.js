//bomAssemblyModel.js
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

async function linkBomToAssembly(assemblyItemId, bomId) {
    const request_data = {
        url: `https://9803855-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=2865&deploy=1`,
        method: 'POST'
    };

    const token = {
        key: config.accessToken,
        secret: config.tokenSecret
    };

    const headers = oauth.toHeader(oauth.authorize(request_data, token));
    headers['Content-Type'] = 'application/json';
    headers['Authorization'] = `${headers['Authorization']}, realm="${config.realm}"`;

    const payload = {
        assemblyItemId,
        bomId
    };

    try {
        const response = await axios.post(request_data.url, payload, { headers });
        return response.data;
    } catch (error) {
        console.error('Error linking BOM to Assembly:', error.response ? error.response.data : error.message);
        throw error;
    }
}

module.exports = { linkBomToAssembly };

//assemblySuiteModel
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

async function querySuiteQL(query) {
    const request_data = {
        url: `${config.baseUrl.replace('/record/v1/bom', '/query/v1/suiteql')}`,
        method: 'POST'
    };

    const token = {
        key: config.accessToken,
        secret: config.tokenSecret
    };

    const headers = oauth.toHeader(oauth.authorize(request_data, token));
    headers['Content-Type'] = 'application/json';
    headers['Authorization'] = `${headers['Authorization']}, realm="${config.realm}"`;
    headers['Prefer'] = 'transient';

    try {
        const response = await axios.post(request_data.url, { q: query }, { headers });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'exécution de SuiteQL:', error.response ? error.response.data : error.message);
        throw error;
    }
}

// Récupérer tous les Assembly Items
async function getAssemblyItems() {
    const query = `SELECT itemid, fullname, id, description, createddate, displayname FROM item WHERE itemtype = 'Assembly'`;
    return await querySuiteQL(query);
}

// Récupérer un Assembly Item par son ID
async function getAssemblyItemById(id) {
    const query = `SELECT itemid, fullname, id, description, createddate, displayname FROM item WHERE itemid = '${id}' AND itemtype = 'Assembly'`;
    return await querySuiteQL(query);
}

module.exports = { getAssemblyItems, getAssemblyItemById };


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

const BASE_URL = 'https://9803855-sb1.suitetalk.api.netsuite.com/services/rest/record/v1';

async function createInventoryItem(itemData) {
    return await createItem('inventoryItem', itemData);
}

async function createAssemblyItem(itemData) {
    return await createItem('assemblyItem', itemData);
}

async function createNonInventoryPurchaseItem(itemData) {
    return await createItem('nonInventoryPurchaseItem', itemData);
}

async function createItem(itemType, itemData) {
    const request_data = {
        url: `${BASE_URL}/${itemType}`,
        method: 'POST'
    };

    const token = {
        key: config.accessToken,
        secret: config.tokenSecret
    };

    const headers = oauth.toHeader(oauth.authorize(request_data, token));
    headers['Content-Type'] = 'application/json';
    headers['Authorization'] = `${headers['Authorization']}, realm="${config.realm}"`;

    // Envoyer le payload tel quel sans transformation
    const payload = itemData;

    console.log(`Sending ${itemType} data:`, payload);
    console.log('Headers:', headers);

    try {
        const response = await axios.post(request_data.url, payload, { headers });
        console.log(`Response from ${itemType} POST:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error creating ${itemType}:`, error.response ? error.response.data : error.message);
        throw error;
    }
}

module.exports = { createInventoryItem, createAssemblyItem, createNonInventoryPurchaseItem };
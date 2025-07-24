// models/bomModel.js
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

async function getBomById(id) {
    const request_data = {
        url: `${config.baseUrl}/${id}`,
        method: 'GET'
    };

    const token = {
        key: config.accessToken,
        secret: config.tokenSecret
    };

    const headers = oauth.toHeader(oauth.authorize(request_data, token));
    headers['Content-Type'] = 'application/json';
    headers['Authorization'] = `${headers['Authorization']}, realm="${config.realm}"`;

    try {
        const response = await axios.get(request_data.url, { headers });
        return response.data;
    } catch (error) {
        console.error('Error fetching BOM:', error);
        throw error;
    }
}

async function createBom(bomData) {
    const request_data = {
        url: `${config.baseUrl}`,
        method: 'POST'
    };

    const token = {
        key: config.accessToken,
        secret: config.tokenSecret
    };

    const headers = oauth.toHeader(oauth.authorize(request_data, token));
    headers['Content-Type'] = 'application/json';
    headers['Authorization'] = `${headers['Authorization']}, realm="${config.realm}"`;

    console.log('Sending BOM data:', bomData);
    console.log('Headers:', headers);

    try {
        const response = await axios.post(request_data.url, bomData, { headers });
        console.log('Response from POST:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating BOM:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function searchBomByName(bomName) {
    const query = `SELECT id, name FROM bom WHERE name = '${bomName.replace(/\r/g, '')}'`;
    const request_data = {
        url: `https://9803855-sb1.suitetalk.api.netsuite.com/services/rest/query/v1/suiteql`,
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
        const items = response.data.items || [];
        return items.length > 0 ? { id: items[0].id, name: items[0].name } : null;
    } catch (error) {
        console.error('Error searching BOM by name:', error.response ? error.response.data : error.message);
        throw error;
    }
}

module.exports = { getBomById, createBom, searchBomByName };
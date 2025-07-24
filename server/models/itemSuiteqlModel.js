//itemSuiteqlModel.js
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
        return response.data.items || [];
    } catch (error) {
        console.error('Error executing SuiteQL query:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function getAllItems() {
    const query = `
        SELECT item.id, item.itemid, item.displayname, rev.name AS revision_name, item.itemtype 
        FROM item 
        LEFT JOIN customrecord_mc_revision_article AS rev ON item.custitem_mc_revision_article = rev.id
    `;
    return await querySuiteQL(query);
}

async function getItemByDisplayName(displayName) {
    const query = `
        SELECT item.id, item.itemid, item.displayname, rev.name AS revision_name, item.itemtype 
        FROM item 
        LEFT JOIN customrecord_mc_revision_article AS rev ON item.custitem_mc_revision_article = rev.id 
        WHERE displayname = '${displayName.replace(/'/g, "''")}' -- Échappe les apostrophes
    `;
    return await querySuiteQL(query);
}
// WHERE isinactive = 'F'
async function getSubitems() {
    const query = `
        SELECT item.id , item.itemid
        FROM item 
        WHERE item.isinactive = 'F'
    `;
    return await querySuiteQL(query);
}

async function getDepartments() {
    const query = `
        SELECT id, name 
        FROM department 
        WHERE isinactive = 'F'
    `;
    return await querySuiteQL(query);
}

async function getLocations() {
    const query = `
        SELECT id, name 
        FROM location 
        WHERE isinactive = 'F'
    `;
    return await querySuiteQL(query);
}

module.exports = { getAllItems, getItemByDisplayName, getSubitems, getDepartments, getLocations };
//itemSuiteqlController.js
const suiteqlModel = require('../models/itemSuiteqlModel');

async function getAllItems(req, res) {
    try {
        const items = await suiteqlModel.getAllItems();
        res.json({ items });
    } catch (error) {
        res.status(500).send('Error retrieving inventory items');
    }
}

async function getItemByDisplayName(req, res) {
    const displayName = req.params.displayName;
    try {
        const item = await suiteqlModel.getItemByDisplayName(displayName);
        res.json({ items: item });
    } catch (error) {
        res.status(500).send('Error retrieving item by display name');
    }
}

async function getSubitems(req, res) {
    try {
        const subitems = await suiteqlModel.getSubitems();
        res.json({ items: subitems });
    } catch (error) {
        res.status(500).send('Error retrieving subitems');
    }
}

async function getDepartments(req, res) {
    try {
        const departments = await suiteqlModel.getDepartments();
        res.json({ items: departments });
    } catch (error) {
        res.status(500).send('Error retrieving departments');
    }
}

async function getLocations(req, res) {
    try {
        const locations = await suiteqlModel.getLocations();
        res.json({ items: locations });
    } catch (error) {
        res.status(500).send('Error retrieving locations');
    }
}

module.exports = { getAllItems, getItemByDisplayName, getSubitems, getDepartments, getLocations };
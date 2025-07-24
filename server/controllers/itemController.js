const itemModel = require('../models/itemModel');

async function createInventoryItem(req, res) {
  const itemData = req.body;
  console.log('Received item data for inventoryItem:', itemData);
  try {
    const newItem = await itemModel.createInventoryItem(itemData);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating inventoryItem:', error);
    if (error.response && error.response.status === 400) {
      res.status(400).json({
        error: 'Erreur lors de la création de l\'item',
        detail: error.response.data['o:errorDetails'][0].detail
      });
    } else {
      res.status(500).send('Error creating inventoryItem');
    }
  }
}

async function createAssemblyItem(req, res) {
  const itemData = req.body;
  console.log('Received item data for assemblyItem:', itemData);
  try {
    const newItem = await itemModel.createAssemblyItem(itemData);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating assemblyItem:', error);
    if (error.response && error.response.status === 400) {
      res.status(400).json({
        error: 'Erreur lors de la création de l\'item',
        detail: error.response.data['o:errorDetails'][0].detail
      });
    } else {
      res.status(500).send('Error creating assemblyItem');
    }
  }
}

async function createNonInventoryPurchaseItem(req, res) {
  const itemData = req.body;
  console.log('Received item data for nonInventoryPurchaseItem:', itemData);
  try {
    const newItem = await itemModel.createNonInventoryPurchaseItem(itemData);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating nonInventoryPurchaseItem:', error);
    if (error.response && error.response.status === 400) {
      res.status(400).json({
        error: 'Erreur lors de la création de l\'item',
        detail: error.response.data['o:errorDetails'][0].detail
      });
    } else {
      res.status(500).send('Error creating nonInventoryPurchaseItem');
    }
  }
}

module.exports = { createInventoryItem, createAssemblyItem, createNonInventoryPurchaseItem };
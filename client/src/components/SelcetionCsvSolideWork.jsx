// SelcetionCsvSolideWork.jsx
import React, { useState } from 'react';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport
} from '@mui/x-data-grid';
import { Box, Button, Typography, CircularProgress, Stack, Dialog, DialogActions, DialogContent, DialogTitle, Slide } from '@mui/material'; // Added Slide here
import * as XLSX from 'xlsx';
import axios from 'axios';
import BomCreationDialog from "./BomCreationDialog"; 
import BomRevisionDialog from "./BomRevisionDialog";

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function PageContainerBasicUpdate() {
  const [clients, setClients] = useState([]);
  const [columns, setColumns] = useState([]);
  const [bomBaseName, setBomBaseName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [openCreationDialog, setOpenCreationDialog] = useState(false);
  const [openRevisionDialog, setOpenRevisionDialog] = useState(false);
  const [configurations, setConfigurations] = useState([]);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [createdBoms, setCreatedBoms] = useState([]); // Stocke { name, id } pour chaque BOM créé
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // Dialogue de confirmation
  const [currentConfig, setCurrentConfig] = useState(null); // Configuration en cours de traitement

  const extractBomName = (fileName) => {
    const regex = /MC[\w-]+/;
    const match = fileName.match(regex);
    return match ? match[0] : '';
  };

  const extractConfigurations = (columnNames) => {
    return columnNames
      .filter((col) => col.includes(" QTY."))
      .map((col) => col.replace(" QTY.", "").replace(/\r/g, '')); // Nettoie les retours chariot
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const baseName = extractBomName(file.name);
      setBomBaseName(baseName);

      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

        const headerIndex = jsonData.length - 1;
        if (headerIndex < 0) {
          alert('Impossible de trouver les noms de colonnes dans le fichier.');
          return;
        }

        let columnNames = jsonData[headerIndex].map(col => col.replace(/\n/g, ' ').trim().replace(/\r/g, '')); // Nettoie les noms
        const filteredData = jsonData.slice(0, headerIndex);
        const transformedData = transformData(filteredData, columnNames);

        setColumns(transformedData.columns);
        setClients(transformedData.rows);
        setConfigurations(extractConfigurations(columnNames));
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // SelcetionCsvSolideWork.jsx (extrait)
  const transformData = (data, columnNames) => {
  const transformedRows = data.map((row, index) => {
    let newRow = { id: index + 1 };
    columnNames.forEach((colName, colIndex) => {
      newRow[colName] = row[colIndex] ? row[colIndex].toString().replace(/\r/g, '') : '-';
    });
    // Extraire "ITEM NO." comme première colonne et l'utiliser pour l'ordre
    newRow.order = parseInt(row[0] || (index + 1)); // Utilise la première colonne comme "ITEM NO."
    // console.log(`Row ${index + 1}: Item No = ${row[0]}, Order = ${newRow.order}`); // Débogage
    return newRow;
  });

  const columnStructure = columnNames.map((col) => ({
    field: col,
    headerName: col,
    width: 200,
  }));

  return { rows: transformedRows, columns: columnStructure };
};

  const handleCreateBom = async (bomData) => {
    if (!bomBaseName || !selectedConfig) {
      setMessage("Erreur: Nom de BOM ou configuration manquante !");
      return;
    }

    setLoading(true);
    setMessage("");

    const bomName = selectedConfig.replace(/\r/g, ''); // Nettoie le nom
    const finalBomData = {
      name: bomName,
      availableForAllAssemblies: bomData.availableForAllAssemblies,
      availableForAllLocations: bomData.availableForAllLocations,
      isInactive: false,
      useComponentYield: false,
      usedOnAssembly: false,
      memo: bomData.memo.replace(/\r/g, ''), // Nettoie le memo
      subsidiary: bomData.subsidiary, // Inclure le champ subsidiary
    };

    // console.log("Final BOM data sent to API:", finalBomData); // Débogage

    try {
      const response = await axios.post("http://localhost:5000/api/bom", finalBomData);
      console.log("Réponse de la création du BOM:", response.data);
      const bomId = response.data.id || (response.data.items && response.data.items[0] && response.data.items[0].id);
      if (bomId) {
        setCreatedBoms([...createdBoms, { name: bomName, id: bomId, config: selectedConfig }]);
        setMessage(`BOM "${bomName}" créé avec succès !`);
      } else {
        setCreatedBoms([...createdBoms, { name: bomName, config: selectedConfig }]); // Sans ID si absent
        setMessage(`BOM "${bomName}" créé, mais ID non récupéré.`);
      }
      setOpenCreationDialog(false);
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.detail && error.response.data.detail.includes("already exists")) {
        setCurrentConfig(selectedConfig); // Stocke la configuration actuelle
        setOpenConfirmDialog(true); // Ouvre le dialogue de confirmation
      } else {
        setMessage(`Erreur lors de la création du BOM: ${error.message}`);
      }
    }

    setLoading(false);
  };

  const handleConfirmAddRevision = (confirm) => {
    if (confirm && currentConfig) {
      setCreatedBoms(prevBoms => {
        const existingBom = prevBoms.find(bom => bom.config === currentConfig);
        if (!existingBom) {
          // Si le BOM n'est pas encore dans la liste, l'ajouter (sans ID si non récupéré)
          return [...prevBoms, { name: currentConfig, config: currentConfig }];
        }
        return prevBoms;
      });
      setOpenRevisionDialog(true); // Active le dialogue de révision
      setOpenConfirmDialog(false); // Ferme le dialogue de confirmation
    } else {
      setMessage(`Création annulée pour "${currentConfig}".`);
      setOpenConfirmDialog(false); // Ferme le dialogue sans action
    }
    setOpenCreationDialog(false); // Ferme le dialogue de création
  };

  const handleOpenBomCreation = (config) => {
    setSelectedConfig(config);
    setOpenCreationDialog(true);
  };

  const handleOpenRevision = (config) => {
    setSelectedConfig(config);
    setOpenRevisionDialog(true);
  };

  const getBomIdByConfig = (config) => {
    const bom = createdBoms.find(b => b.config === config);
    return bom ? bom.id : null;
  };

  return (
    <div style={{ width: '100%', padding: '20px' }}>
      <Typography variant="h4" sx={{ marginBottom: '20px' }}>
        Gestion des BOMs et Révisions
      </Typography>

      {/* Section d'importation */}
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: 2 }}>
        <Button
          variant="contained"
          component="label"
          sx={{ minWidth: '200px' }}
        >
          Importer un fichier Excel
          <input
            type="file"
            accept=".xlsx,.xls"
            hidden
            onChange={handleFileUpload}
          />
        </Button>
        {bomBaseName && (
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'green' }}>
            Nom de base du BOM: {bomBaseName}
          </Typography>
        )}
      </Box>

      {/* Section des actions par configuration */}
      <Box sx={{ marginBottom: '20px', width: '20%' }}>
        <Typography variant="h6" sx={{ marginBottom: '10px', fontWeight: 'bold' }}>
          Actions par Configuration
        </Typography>
        {configurations.map((config, index) => {
          const bomCreated = createdBoms.some(bom => bom.config === config);
          const bomName = `${config}`;
          return (
            <Stack
              key={index}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#e0e7ff',
                  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
                },
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 'medium', paddingLeft: '10px' }}>
                {bomName}
              </Typography>
              <Stack direction="row" spacing={2} sx={{ paddingRight: '10px' }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleOpenBomCreation(config)}
                  disabled={bomCreated || loading || (createdBoms.some(bom => bom.name === bomName && bom.id))}
                  sx={{ minWidth: '140px', fontSize: '0.875rem' }}
                >
                  Créer BOM
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleOpenRevision(config)}
                  disabled={!bomCreated || loading}
                  sx={{ minWidth: '140px', fontSize: '0.875rem' }}
                >
                  Ajouter Révision
                </Button>
              </Stack>
            </Stack>
          );
        })}
      </Box>

      {/* Dialogue de création */}
      <BomCreationDialog
        open={openCreationDialog}
        onClose={() => setOpenCreationDialog(false)}
        onCreate={handleCreateBom}
        bomName={selectedConfig ? `${selectedConfig}` : ''}
      />

      {/* Dialogue de révision */}
      <BomRevisionDialog
        open={openRevisionDialog}
        onClose={() => setOpenRevisionDialog(false)}
        revisionName={selectedConfig}
        data={clients}
        bomId={getBomIdByConfig(selectedConfig)}
        bomName={selectedConfig ? `${selectedConfig}` : ''}
      />

      {/* Dialogue de confirmation */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' }}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '12px',
            padding: '20px',
            maxWidth: '400px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          BOM Existante
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ marginBottom: '20px', color: '#444' }}>
            Le BOM "{currentConfig}" existe déjà. Souhaitez-vous lui ajouter une révision ?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', padding: '0 20px 20px 20px' }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleConfirmAddRevision(false)}
            sx={{
              minWidth: '120px',
              borderColor: '#d32f2f',
              color: '#d32f2f',
              '&:hover': { borderColor: '#b71c1c', backgroundColor: 'rgba(211, 47, 47, 0.1)' },
            }}
          >
            Non
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleConfirmAddRevision(true)}
            sx={{
              minWidth: '120px',
              backgroundColor: '#1976d2',
              '&:hover': { backgroundColor: '#1565c0' },
            }}
          >
            Oui
          </Button>
        </DialogActions>
      </Dialog>

      {/* Message de statut */}
      {message && (
        <Typography
          variant="body2"
          sx={{ marginTop: '10px', color: message.includes('Erreur') ? 'red' : 'green' }}
        >
          {message}
        </Typography>
      )}

      {/* Tableau des données */}
      <Box sx={{ height: '600px', width: '100%', marginTop: '20px' }}>
        <DataGrid
          rows={clients.map((client, index) => ({ id: index, ...client }))}
          columns={columns}
          loading={loading}
          components={{ Toolbar: CustomToolbar }}
          disableRowSelectionOnClick
          disableSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
        />
      </Box>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Button,
  TextField,
  Select,
  MenuItem,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"; // Utilisation de @hello-pangea/dnd

// Animation pour le slider
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function BomRevisionDialog({ open, onClose, revisionName, data, bomName }) {
  const [tableData, setTableData] = useState([]);
  const [memo, setMemo] = useState(""); // ✅ MEMO
  const [startDate, setStartDate] = useState(""); // ✅ Effective Start Date
  const [endDate, setEndDate] = useState(""); // ✅ Effective End Date

  useEffect(() => {
    if (data.length > 0 && revisionName) {
      setMemo("");
      setStartDate("");
      setEndDate("");
      const filteredData = data
        .filter((row) => row[revisionName + " QTY."] !== "-" && row[revisionName + " QTY."] !== 0)
        .map((row, index) => ({
          id: `item-${index}`,
          item: row["PART NUMBER"] || "",
          componentYield: "100.0%",
          bomQuantity: row[revisionName + " QTY."],
          itemSource: "Stock",
          units: "UN", // ✅ Valeur par défaut
          order: index + 1,
        }));
      setTableData(filteredData);
    }
  }, [data, revisionName]);

  // ✅ Gestion du drag and drop
  const handleDragEnd = (result) => {
    if (!result.destination) return; // Si l'élément est déposé hors de la liste

    const newData = [...tableData];
    const [movedItem] = newData.splice(result.source.index, 1);
    newData.splice(result.destination.index, 0, movedItem);

    // ✅ Mettre à jour l'ordre après déplacement
    const updatedData = newData.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    setTableData(updatedData);
  };

  const handleInputChange = (index, field, value) => {
    const newData = [...tableData];
    newData[index][field] = value;
    setTableData(newData);
  };

  // ✅ Formatage des dates
  const formatDate = (date) => {
    if (!date || isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Assure un format 2 chiffres
    const day = String(date.getDate()).padStart(2, "0"); // Assure un format 2 chiffres
    return `${year}/${month}/${day}`;
  };

  const handleCreateBomRevision = async () => {
    // 🔹 Vérifier que les champs nécessaires sont remplis
    if (!bomName || !revisionName || !startDate || !endDate) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
  
    // 🔹 Construire l'objet JSON à envoyer au backend
    const bomRevisionData = {
      billOfMaterials: {
        refName: bomName, // ✅ Correction : Utiliser le nom du BOM et non la révision
      },
      name: revisionName, // ✅ Correction : Utiliser le nom de la révision
      memo: memo, // ✅ Récupérer la valeur du champ MEMO
      effectiveStartDate: startDate,
      effectiveEndDate: endDate,
      isInactive: false,
      component: {
        items: tableData.map((row, index) => ({
          item: {
            refName: row.item, // ✅ Récupérer la valeur de la colonne "Item"
          },
          quantity: row.bomQuantity, // ✅ Récupérer la quantité de la colonne "BOM Quantity"
          componentYield: parseFloat(row.componentYield) || 100.0, // ✅ Récupération dynamique du champ
          itemSource: {
            id: row.itemSource.toUpperCase(), // ✅ Récupération dynamique du champ
            refName: row.itemSource,
          },
          lineSequenceNumber: index + 1, // ✅ Numéro de ligne
        })),
      },
    };
  
    try {
      // 🔹 Envoyer la requête POST au backend
      console.log("bomRevisionData",bomRevisionData);
      const response = await fetch("http://localhost:5000/api/bom-revision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bomRevisionData),
      });
  
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
  
      const result = await response.json();
      alert(`BOM Revision créée avec succès: ${result.name}`);
      onClose(); // ✅ Fermer le popup après la création
    } catch (error) {
      console.error("Erreur lors de la création de la BOM Revision:", error);
      alert("Échec de la création de la BOM Revision.");
    }
  };
  
  
  

  return (
    <Dialog open={open} TransitionComponent={Transition} keepMounted onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Configuration de la révision {revisionName}</DialogTitle>
      <DialogContent>
        {/* ✅ Champs au-dessus de la table */}
        <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
          Informations générales :
        </Typography>
        <TextField
          fullWidth
          label="MEMO"
          multiline
          rows={2}
          variant="outlined"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Effective Start Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          sx={{ marginRight: 2 }}
        />
        <TextField
          label="Effective End Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        {/* ✅ Table avec Drag & Drop */}
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="table-body">
              {(provided) => (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell>Component Yield</TableCell>
                      <TableCell>BOM Quantity</TableCell>
                      <TableCell>Item Source</TableCell>
                      <TableCell>Units</TableCell>
                      <TableCell>Ordre</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                    {tableData.map((row, index) => (
                      <Draggable key={row.id} draggableId={row.id} index={index}>
                        {(provided) => (
                          <TableRow
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{ backgroundColor: "#f9f9f9", ...provided.draggableProps.style }}
                          >
                            <TableCell>{row.item}</TableCell>
                            <TableCell>
                              <TextField
                                type="text"
                                value={row.componentYield}
                                onChange={(e) => handleInputChange(index, "componentYield", e.target.value)}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>{row.bomQuantity}</TableCell>
                            <TableCell>
                              <Select
                                value={row.itemSource}
                                onChange={(e) => handleInputChange(index, "itemSource", e.target.value)}
                                size="small"
                              >
                                <MenuItem value="Phantom">Phantom</MenuItem>
                                <MenuItem value="Purchase Order">Purchase Order</MenuItem>
                                <MenuItem value="Stock">Stock</MenuItem>
                                <MenuItem value="Work Order">Work Order</MenuItem>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={row.units}
                                onChange={(e) => handleInputChange(index, "units", e.target.value)}
                                size="small"
                              >
                                <MenuItem value="UN">UN</MenuItem>
                                <MenuItem value="in">in</MenuItem>
                                <MenuItem value="mm">mm</MenuItem>
                                <MenuItem value="ft">ft</MenuItem>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Select value={row.order} size="small" disabled>
                                {tableData.map((_, i) => (
                                  <MenuItem key={i} value={i + 1}>
                                    {i + 1}
                                  </MenuItem>
                                ))}
                              </Select>
                            </TableCell>
                          </TableRow>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </TableBody>
                </Table>
              )}
            </Droppable>
          </DragDropContext>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button
          onClick={handleCreateBomRevision}
          color="primary"
          variant="contained"
        >
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
// BomRevisionDialog.jsx
// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Slide,
//   Button,
//   TextField,
//   Select,
//   MenuItem,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
// } from "@mui/material";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
// import axios from "axios";

// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

// export default function BomRevisionDialog({ open, onClose, revisionName, data, bomId, bomName }) {
//   const [tableData, setTableData] = useState([]);
//   const [memo, setMemo] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [netSuiteItems, setNetSuiteItems] = useState({});

//   useEffect(() => {
//     const fetchNetSuiteItems = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/suiteql/items");
//         const itemsArray = response.data.items || [];
//         const itemsMap = {};
//         itemsArray.forEach(item => {
//           itemsMap[item.displayname] = {
//             id: item.id,
//             revision: item.revision_name || "Pas de révision"
//           };
//         });
//         setNetSuiteItems(itemsMap);
//       } catch (error) {
//         console.error("Erreur lors de la récupération des items NetSuite:", error);
//       }
//     };
//     fetchNetSuiteItems();
//   }, []);

//   useEffect(() => {
//     if (data.length > 0 && revisionName) {
//       setMemo("");
//       setStartDate("");
//       setEndDate("");
//       const filteredData = data
//         .filter((row) => row[revisionName + " QTY."] !== "-" && row[revisionName + " QTY."] !== 0)
//         .map((row, index) => ({
//           id: `item-${index}`,
//           item: row["PART NUMBER"] || "",
//           itemId: netSuiteItems[row["PART NUMBER"]]?.id || "Item inexistant, merci de le créer dans NetSuite",
//           revision_name: netSuiteItems[row["PART NUMBER"]]?.revision || "Pas de révision",
//           componentYield: "100.0%",
//           bomQuantity: row[revisionName + " QTY."],
//           itemSource: "Stock",
//           units: "UN",
//           order: index + 1,
//         }));
//       setTableData(filteredData);
//     }
//   }, [data, revisionName, netSuiteItems]);

//   const handleDragEnd = (result) => {
//     if (!result.destination) return;
//     const newData = [...tableData];
//     const [movedItem] = newData.splice(result.source.index, 1);
//     newData.splice(result.destination.index, 0, movedItem);
//     const updatedData = newData.map((item, index) => ({
//       ...item,
//       order: index + 1,
//     }));
//     setTableData(updatedData);
//   };

//   const handleInputChange = (index, field, value) => {
//     const newData = [...tableData];
//     newData[index][field] = value;
//     setTableData(newData);
//   };

//   const fetchBomIdByName = async (bomName) => {
//     try {
//       const response = await axios.get(`http://localhost:5000/api/bom/search?name=${encodeURIComponent(bomName)}`);
//       return response.data.id; // Supposons que l'API renvoie { id, ... }
//     } catch (error) {
//       console.error(`Erreur lors de la récupération de l'ID pour BOM ${bomName}:`, error);
//       return null;
//     }
//   };

//   const handleCreateBomRevision = async () => {
//     if (!revisionName || !startDate || !endDate) {
//       alert("Veuillez remplir tous les champs obligatoires.");
//       return;
//     }

//     let effectiveBomId = bomId;
//     if (!effectiveBomId) {
//       // Tenter de récupérer l'ID par nom si non fourni
//       effectiveBomId = await fetchBomIdByName(bomName);
//       if (!effectiveBomId) {
//         alert(`Impossible de récupérer l'ID du BOM "${bomName}". Vérifiez le nom ou la connexion à NetSuite.`);
//         return;
//       }
//     }

//     const filteredItems = tableData.map((row, index) => {
//       const itemData = netSuiteItems[row.item];
//       const validItemId = itemData && itemData.id ? itemData.id : null;
//       return {
//         item: validItemId ? { id: validItemId, refName: row.item } : null,
//         bomquantity: parseInt(row.bomQuantity, 10),
//         lineSequenceNumber: index + 1,
//         custrecord_mc_ordre: index + 1
//       };
//     });

//     const bomRevisionData = {
//       billOfMaterials: {
//         id: effectiveBomId,
//       },
//       name: revisionName,
//       memo: memo,
//       effectiveStartDate: startDate,
//       effectiveEndDate: endDate,
//       isInactive: false,
//       component: {
//         items: filteredItems,
//       },
//     };

//     try {
//       console.log("Données envoyées à NetSuite :", JSON.stringify(bomRevisionData, null, 2));
//       const response = await fetch("http://localhost:5000/api/bom-revision", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(bomRevisionData),
//       });

//       if (!response.ok) {
//         throw new Error(`Erreur HTTP: ${response.status}`);
//       }

//       const result = await response.json();
//       alert(`BOM Revision créée avec succès: ${bomRevisionData.name}`);
//       onClose();
//     } catch (error) {
//       console.error("Erreur lors de la création de la BOM Revision:", error);
//       alert("Échec de la création de la BOM Revision.");
//     }
//   };

//   return (
//     <Dialog open={open} TransitionComponent={Transition} keepMounted onClose={onClose} fullWidth maxWidth="md">
//       <DialogTitle>Configuration de la révision {revisionName}</DialogTitle>
//       <DialogContent>
//         <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
//           Informations générales :
//         </Typography>
//         <TextField
//           fullWidth
//           label="MEMO"
//           multiline
//           rows={2}
//           variant="outlined"
//           value={memo}
//           onChange={(e) => setMemo(e.target.value)}
//           sx={{ marginBottom: 2 }}
//         />
//         <TextField
//           label="Effective Start Date"
//           type="date"
//           InputLabelProps={{ shrink: true }}
//           value={startDate}
//           onChange={(e) => setStartDate(e.target.value)}
//           sx={{ marginRight: 2 }}
//         />
//         <TextField
//           label="Effective End Date"
//           type="date"
//           InputLabelProps={{ shrink: true }}
//           value={endDate}
//           onChange={(e) => setEndDate(e.target.value)}
//         />

//         <TableContainer component={Paper} sx={{ marginTop: 2 }}>
//           <DragDropContext onDragEnd={handleDragEnd}>
//             <Droppable droppableId="table-body">
//               {(provided) => (
//                 <Table>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Item</TableCell>
//                       <TableCell>Item ID</TableCell>
//                       <TableCell>BOM Quantity</TableCell>
//                       <TableCell>Révision</TableCell>
//                       <TableCell>Ordre</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody ref={provided.innerRef} {...provided.droppableProps}>
//                     {tableData.map((row, index) => (
//                       <Draggable key={row.id} draggableId={row.id} index={index}>
//                         {(provided) => (
//                           <TableRow
//                             ref={provided.innerRef}
//                             {...provided.draggableProps}
//                             {...provided.dragHandleProps}
//                             style={{ backgroundColor: "#f9f9f9", ...provided.draggableProps.style }}
//                           >
//                             <TableCell>{row.item}</TableCell>
//                             <TableCell>{row.itemId}</TableCell>
//                             <TableCell>{row.bomQuantity}</TableCell>
//                             <TableCell>{row.revision_name}</TableCell>
//                             <TableCell>
//                               <Select value={row.order} size="small" disabled>
//                                 {tableData.map((_, i) => (
//                                   <MenuItem key={i} value={i + 1}>
//                                     {i + 1}
//                                   </MenuItem>
//                                 ))}
//                               </Select>
//                             </TableCell>
//                           </TableRow>
//                         )}
//                       </Draggable>
//                     ))}
//                     {provided.placeholder}
//                   </TableBody>
//                 </Table>
//               )}
//             </Droppable>
//           </DragDropContext>
//         </TableContainer>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="secondary">Annuler</Button>
//         <Button onClick={handleCreateBomRevision} color="primary" variant="contained">Enregistrer</Button>
//       </DialogActions>
//     </Dialog>
//   );
// }


//code correcte mai leng avec accordiant

// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Slide,
//   Button,
//   TextField,
//   Select,
//   MenuItem,
//   Typography,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Grid,
//   Autocomplete,
//   TextareaAutosize,
//   Box,
//   Checkbox,
//   FormControlLabel,
// } from "@mui/material";
// import axios from "axios";
// import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
// import { styled } from '@mui/material/styles';

// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

// // Composants stylisés pour l'accordéon
// const CustomAccordion = styled((props) => (
//   <Accordion disableGutters elevation={0} square {...props} />
// ))(({ theme }) => ({
//   border: `1px solid ${theme.palette.divider}`,
//   '&:not(:last-child)': {
//     borderBottom: 0,
//   },
//   '&::before': {
//     display: 'none',
//   },
//   width: '100%',
// }));

// const CustomAccordionSummary = styled((props) => (
//   <AccordionSummary
//     expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
//     {...props}
//   />
// ))(({ theme }) => ({
//   backgroundColor: 'rgba(0, 0, 0, .03)',
//   minHeight: 48,
//   '& .MuiAccordionSummary-content': {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     margin: theme.spacing(0, 1),
//   },
//   '& .MuiAccordionSummary-expandIconWrapper': {
//     padding: 0,
//   },
//   '&:hover': {
//     backgroundColor: 'rgba(0, 0, 0, .05)',
//   },
//   ...theme.applyStyles('dark', {
//     backgroundColor: 'rgba(255, 255, 255, .05)',
//   }),
// }));

// const CustomAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
//   padding: theme.spacing(2),
//   borderTop: '1px solid rgba(0, 0, 0, .125)',
// }));

// // Liste statique des départements
// const staticDepartments = [
//   { id: 1, name: "Production" },
//   { id: 2, name: "Sales" },
//   { id: 3, name: "Engineering" },
//   { id: 4, name: "Quality Control" },
// ];

// // Liste statique des emplacements
// const staticLocations = [
//   { id: 207, name: "ATELIER D'USINAGE GOBEIL" },
//   { id: 208, name: "CNC PARADIS" },
//   { id: 209, name: "CUSTOM ELECTRONICS INC" },
//   { id: 112, name: "Entrepôt MCT 2425" },
//   { id: 113, name: "Entrepôt MCT 2500-102" },
//   { id: 114, name: "Entrepôt MCT Camion" },
//   { id: 206, name: "Entrepôt Mindcore 91 Théodore-Viau" },
//   { id: 210, name: "ENVITECH AUTOMATION" },
//   { id: 211, name: "EPP METAL" },
//   { id: 307, name: "EPP MÉTAL" },
//   { id: 212, name: "ETS" },
//   { id: 213, name: "FERROTECH" },
//   { id: 102, name: "GS - Test WH location 1" },
//   { id: 214, name: "LEVFAB" },
//   { id: 216, name: "MDL ENERGIE" },
//   { id: 217, name: "MEA TECH" },
//   { id: 218, name: "MECTOR" },
//   { id: 215, name: "METAL CN INC" },
//   { id: 219, name: "MICRON" },
//   { id: 220, name: "MSG INDUSTRIES" },
//   { id: 308, name: "MÉTAL CN INC" },
//   { id: 103, name: "Outsource Manufacturing" },
//   { id: 105, name: "Outsource Manufacturing - Manufacturier Externe 1" },
//   { id: 104, name: "Outsource Manufacturing - Manufacturier Externe 2" },
//   { id: 221, name: "PLACAGE EXEL" },
//   { id: 222, name: "PRECISION PLATING" },
//   { id: 223, name: "PRO-STEL" },
//   { id: 224, name: "RAPID PRECISION INDUSTRIES" },
//   { id: 225, name: "REICAR" },
//   { id: 226, name: "SCHOLER" },
//   { id: 227, name: "SOLUTION USINAGE" },
//   { id: 1, name: "Test Manufacturing location" },
//   { id: 228, name: "TOURMAC" },
//   { id: 229, name: "ULTIMAXS" },
//   { id: 230, name: "USINAGE LAC MASSON" },
//   { id: 231, name: "USINAGE PROTECH" },
//   { id: 232, name: "USINATEK MR" },
// ];

// // Définitions des unités
// const unitTypes = [
//   { id: 3, refName: "Longueur" },
//   { id: 4, refName: "Poids" },
//   { id: 2, refName: "Quantité" },
// ];

// export default function BomRevisionDialog({ open, onClose, revisionName, data, bomId, bomName }) {
//   const [tableData, setTableData] = useState([]);
//   const [memo, setMemo] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [netSuiteItems, setNetSuiteItems] = useState({});
//   const [newItems, setNewItems] = useState({});
//   const [subitems, setSubitems] = useState([]);
//   const [isSaveEnabled, setIsSaveEnabled] = useState(false);
//   const [expanded, setExpanded] = useState(null); // État pour gérer l'expansion de l'accordéon

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         const [netSuiteItemsResp, subitemsResp] = await Promise.all([
//           axios.get("http://localhost:5000/api/suiteql/items"),
//           axios.get("http://localhost:5000/api/suiteql/subitems"),
//         ]);

//         // Traitement des items NetSuite
//         const itemsArray = netSuiteItemsResp.data.items || [];
//         const itemsMap = {};
//         itemsArray.forEach(item => {
//           itemsMap[item.displayname] = {
//             id: item.id,
//             revision: item.revision_name || "Pas de révision",
//           };
//         });
//         setNetSuiteItems(itemsMap);

//         // Utiliser subitemsData directement avec id comme clé unique
//         const subitemsData = subitemsResp.data.items || [];
//         console.log("Subitems data:", subitemsData); // Débogage
//         setSubitems(subitemsData); // Stocker les données brutes
//         console.log("Subitems apres traitement:", subitems); // Débogage
//       } catch (error) {
//         console.error("Erreur lors du chargement initial des données:", error);
//       }
//     };

//     fetchInitialData();
//   }, []); // Vide pour ne s'exécuter qu'au montage

//   useEffect(() => {
//     if (data.length > 0 && revisionName) {
//       setMemo("");
//       setStartDate("");
//       setEndDate("");
//       const filteredData = data
//         .filter((row) => row[revisionName + " QTY."] !== "-" && row[revisionName + " QTY."] !== 0)
//         .map((row, index) => {
//           const itemName = row["PART NUMBER"] || "";
//           const itemData = netSuiteItems[itemName] || null;
//           if (!itemData && itemName) {
//             setNewItems(prev => ({
//               ...prev,
//               [itemName]: {
//                 itemId: itemName,
//                 displayName: itemName,
//                 salesDescription: "",
//                 upcCode: "",
//                 itemType: "inventoryItem",
//                 parent: null,
//                 department: null,
//                 location: null,
//                 subsidiary: { items: [{ id: "2" }] },
//                 unitType: { id: 2, refName: "Quantité" },
//                 includeChildren: false,
//                 useBins: false,
//                 custitem_gs_desc_en: "",
//                 autoLeadTime: true,
//                 autoPreferredStockLevel: true,
//                 autoReorderPoint: true,
//                 copyDescription: false,
//                 enforceminqtyinternally: true,
//                 isDropShipItem: false,
//                 isHazmatItem: false,
//                 isInactive: false,
//                 isLotItem: false,
//                 isSerialItem: false,
//                 isSpecialOrderItem: false,
//                 matchBillToReceipt: false,
//                 offerSupport: false,
//                 roundUpAsComponent: false,
//                 seasonalDemand: false,
//                 shipIndividually: false,
//                 trackLandedCost: false,
//                 updateExistingTranAccounts: false,
//                 useMarginalRates: false,
//               },
//             }));
//           }
//           // Utiliser directement la propriété "order" passée via data
//           const order = row.order; // Utiliser row.order défini dans transformData
//           return {
//             id: `item-${itemName}-${order}-${index}`, // Ajouter index pour garantir l'unicité en cas de doublons
//             item: itemName,
//             itemId: itemData ? itemData.id : null,
//             revision_name: itemData ? itemData.revision : "Pas de révision",
//             bomQuantity: row[revisionName + " QTY."],
//             order: order, // Utiliser l'ordre existant
//           };
//         })
//         .sort((a, b) => a.order - b.order); // Trier par ordre croissant basé sur "order"
//       setTableData(filteredData);
//       setIsSaveEnabled(filteredData.every(row => row.itemId !== null));
//     }
//   }, [data, revisionName, netSuiteItems]);

//   const handleNewItemChange = (itemName, field, value) => {
//     setNewItems(prev => ({
//       ...prev,
//       [itemName]: {
//         ...prev[itemName],
//         [field]: value,
//       },
//     }));
//   };

//   const createNewItem = async (itemName) => {
//     const itemData = newItems[itemName];
//     try {
//       console.log("Item data sent:", itemData); // Débogage
//       const response = await axios.post(`http://localhost:5000/api/item/${itemData.itemType}`, itemData);
//       const newItemId = response.data.id;
//       setNetSuiteItems(prev => ({
//         ...prev,
//         [itemName]: { id: newItemId, revision: "N/A" },
//       }));
//       setNewItems(prev => {
//         const { [itemName]: _, ...rest } = prev;
//         return rest;
//       });
//       setTableData(prev =>
//         prev.map(row =>
//           row.item === itemName ? { ...row, itemId: newItemId } : row
//         )
//       );
//       setIsSaveEnabled(tableData.every(row => row.itemId !== null));
//       alert(`Item "${itemName}" créé avec l'ID ${newItemId}`);
//     } catch (error) {
//       console.error(`Erreur lors de la création de l'item ${itemName}:`, error);
//       alert(`Échec de la création de l'item ${itemName}: ${error.response?.data?.detail || error.message}`);
//     }
//   };

//   const fetchBomIdByName = async (bomName) => {
//     try {
//       const response = await axios.get(`http://localhost:5000/api/bom/search?name=${encodeURIComponent(bomName)}`);
//       return response.data.id;
//     } catch (error) {
//       console.error(`Erreur lors de la récupération de l'ID pour BOM ${bomName}:`, error);
//       return null;
//     }
//   };

//   const handleCreateBomRevision = async () => {
//     if (!revisionName || !startDate || !endDate) {
//       alert("Veuillez remplir tous les champs obligatoires.");
//       return;
//     }

//     let effectiveBomId = bomId;
//     if (!effectiveBomId) {
//       effectiveBomId = await fetchBomIdByName(bomName);
//       if (!effectiveBomId) {
//         alert(`Impossible de récupérer l'ID du BOM "${bomName}".`);
//         return;
//       }
//     }

//     const filteredItems = tableData.map((row, index) => {
//       const itemData = netSuiteItems[row.item] || (row.itemId ? { id: row.itemId } : null);
//       return {
//         item: itemData ? { id: itemData.id, refName: row.item } : null,
//         bomquantity: parseInt(row.bomQuantity, 10),
//         lineSequenceNumber: row.order, // Utiliser l'ordre basé sur "order"
//         custrecord_mc_ordre: row.order,
//       };
//     });

//     const bomRevisionData = {
//       billOfMaterials: { id: effectiveBomId },
//       name: revisionName,
//       memo,
//       effectiveStartDate: startDate,
//       effectiveEndDate: endDate,
//       isInactive: false,
//       component: { items: filteredItems },
//     };

//     try {
//       console.log("Données envoyées à NetSuite :", JSON.stringify(bomRevisionData, null, 2));
//       const response = await fetch("http://localhost:5000/api/bom-revision", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(bomRevisionData),
//       });

//       if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
//       const result = await response.json();
//       alert(`BOM Revision créée avec succès: ${bomRevisionData.name}`);
//       onClose();
//     } catch (error) {
//       console.error("Erreur lors de la création de la BOM Revision:", error);
//       alert("Échec de la création de la BOM Revision.");
//     }
//   };

//   // Gestion de l'expansion de l'accordéon
//   const handleAccordionChange = (panel) => (event, isExpanded) => {
//     setExpanded(isExpanded ? panel : null);
//   };

//   return (
//     <Dialog open={open} TransitionComponent={Transition} keepMounted onClose={onClose} fullWidth maxWidth="md">
//       <DialogTitle>Configuration de la révision {revisionName}</DialogTitle>
//       <DialogContent>
//         <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
//           Informations générales :
//         </Typography>
//         <TextField
//           fullWidth
//           label="MEMO"
//           multiline
//           rows={2}
//           variant="outlined"
//           value={memo}
//           onChange={(e) => setMemo(e.target.value)}
//           sx={{ marginBottom: 2 }}
//         />
//         <TextField
//           label="Effective Start Date"
//           type="date"
//           InputLabelProps={{ shrink: true }}
//           value={startDate}
//           onChange={(e) => setStartDate(e.target.value)}
//           sx={{ marginRight: 2 }}
//         />
//         <TextField
//           label="Effective End Date"
//           type="date"
//           InputLabelProps={{ shrink: true }}
//           value={endDate}
//           onChange={(e) => setEndDate(e.target.value)}
//         />

//         {/* Caption améliorée */}
//         <Box
//           sx={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             width: '100%',
//             padding: '12px 16px',
//             backgroundColor: '#f5f5f5',
//             borderBottom: '2px solid #e0e0e0',
//             marginLeft: '0px',
//             boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//           }}
//         >
//           <Box sx={{ display: 'flex', gap: 4 }}>
//             <Typography
//               sx={{
//                 minWidth: '100px',
//                 maxWidth: '50px',
//                 fontWeight: 'bold',
//                 color: '#1976d2',
//                 textAlign: 'center',
//               }}
//             >
//               Part Number
//             </Typography>
//             <Typography
//               sx={{
//                 minWidth: '100px',
//                 maxWidth: '50px',
//                 fontWeight: 'bold',
//                 color: '#1976d2',
//                 textAlign: 'center',
//               }}
//             >
//               Item ID
//             </Typography>
//             <Typography
//               sx={{
//                 minWidth: '100px',
//                 maxWidth: '50px',
//                 fontWeight: 'bold',
//                 color: '#1976d2',
//                 textAlign: 'center',
//               }}
//             >
//               Qte
//             </Typography>
//             <Typography
//               sx={{
//                 minWidth: '100px',
//                 maxWidth: '50px',
//                 fontWeight: 'bold',
//                 color: '#1976d2',
//                 textAlign: 'center',
//               }}
//             >
//               Révision
//             </Typography>
//             <Typography
//               sx={{
//                 minWidth: '100px',
//                 maxWidth: '50px',
//                 fontWeight: 'bold',
//                 color: '#1976d2',
//                 textAlign: 'center',
//               }}
//             >
//               Ordre
//             </Typography>
//           </Box>
//         </Box>

//         {tableData.map((row) => (
//           <CustomAccordion
//             key={`item-${row.item}-${row.order}-${Date.now()}`}
//             disabled={row.itemId !== null}
//             expanded={expanded === row.id}
//             onChange={handleAccordionChange(row.id)}
//           >
//             <CustomAccordionSummary
//               aria-controls={`panel-${row.id}-content`}
//               id={`panel-${row.id}-header`}
//             >
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '8px 0' }}>
//                 <Box sx={{ display: 'flex', gap: 4 }}>
//                   <Typography sx={{ minWidth: '100px', maxWidth: '50px' }}>{row.item}</Typography>
//                   <Typography sx={{ minWidth: '100px', maxWidth: '50px' }}>
//                     {row.itemId || 'Item inexistant'}
//                   </Typography>
//                   <Typography sx={{ minWidth: '100px', maxWidth: '50px' }}>{row.bomQuantity}</Typography>
//                   <Typography sx={{ minWidth: '100px', maxWidth: '50px' }}>{row.revision_name}</Typography>
//                   <Typography sx={{ minWidth: '100px', maxWidth: '50px' }}>{row.order}</Typography>
//                 </Box>
//               </Box>
//             </CustomAccordionSummary>
//             <CustomAccordionDetails>
//               <Grid container spacing={2}>
//                 <Grid item xs={12} sm={4}>
//                   <Select
//                     fullWidth
//                     value={newItems[row.item]?.itemType || "inventoryItem"}
//                     onChange={(e) => handleNewItemChange(row.item, "itemType", e.target.value)}
//                     label="Item Type"
//                   >
//                     <MenuItem value="inventoryItem">Inventory Item</MenuItem>
//                     <MenuItem value="assemblyItem">Assembly Item</MenuItem>
//                     <MenuItem value="nonInventoryPurchaseItem">Non-Inventory Purchase Item</MenuItem>
//                   </Select>
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <TextField
//                     fullWidth
//                     label="Item Name/Number (Item ID)"
//                     value={newItems[row.item]?.itemId || ""}
//                     onChange={(e) => handleNewItemChange(row.item, "itemId", e.target.value)}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <TextField
//                     fullWidth
//                     label="Display Name/Code (Display Name)"
//                     value={newItems[row.item]?.displayName || ""}
//                     onChange={(e) => handleNewItemChange(row.item, "displayName", e.target.value)}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <TextareaAutosize
//                     minRows={3}
//                     placeholder="Description (en français)"
//                     value={newItems[row.item]?.salesDescription || ""}
//                     onChange={(e) => handleNewItemChange(row.item, "salesDescription", e.target.value)}
//                     style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <TextareaAutosize
//                     minRows={3}
//                     placeholder="Description (en anglais)"
//                     value={newItems[row.item]?.custitem_gs_desc_en || ""}
//                     onChange={(e) => handleNewItemChange(row.item, "custitem_gs_desc_en", e.target.value)}
//                     style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <TextField
//                     fullWidth
//                     label="UPC Code"
//                     value={newItems[row.item]?.upcCode || ""}
//                     onChange={(e) => handleNewItemChange(row.item, "upcCode", e.target.value)}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <Autocomplete
//                     fullWidth
//                     options={subitems}
//                     getOptionLabel={(option) => option.itemid || ""}
//                     value={subitems.find(item => item.id === (newItems[row.item]?.parent?.id || null)) || null}
//                     onChange={(e, value) => handleNewItemChange(row.item, "parent", value ? { id: value.id } : null)}
//                     renderInput={(params) => <TextField {...params} label="Subitem of (Parent)" />}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <Autocomplete
//                     fullWidth
//                     options={staticDepartments}
//                     getOptionLabel={(option) => option.name || ""}
//                     value={staticDepartments.find(dept => dept.id === (newItems[row.item]?.department?.id || null)) || null}
//                     onChange={(e, value) => handleNewItemChange(row.item, "department", value ? { id: value.id } : null)}
//                     renderInput={(params) => <TextField {...params} label="Department" />}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <Autocomplete
//                     fullWidth
//                     options={staticLocations}
//                     getOptionLabel={(option) => option.name || ""}
//                     value={staticLocations.find(loc => loc.id === (newItems[row.item]?.location?.id || null)) || null}
//                     onChange={(e, value) => handleNewItemChange(row.item, "location", value ? { id: value.id } : null)}
//                     renderInput={(params) => <TextField {...params} label="Location" />}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <Select
//                     fullWidth
//                     value={(newItems[row.item]?.subsidiary?.items[0]?.id) || "2"}
//                     onChange={(e) => handleNewItemChange(row.item, "subsidiary", { items: [{ id: e.target.value }] })}
//                     label="Subsidiary"
//                   >
//                     <MenuItem value="1">Parent Company</MenuItem>
//                     <MenuItem value="2">Mindcore</MenuItem>
//                   </Select>
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <Select
//                     fullWidth
//                     value={newItems[row.item]?.unitType?.refName || "Quantité"}
//                     onChange={(e) => {
//                       const selectedUnit = unitTypes.find(unit => unit.refName === e.target.value);
//                       handleNewItemChange(row.item, "unitType", selectedUnit || { id: 2, refName: "Quantité" });
//                     }}
//                     label="Primary Units Type"
//                   >
//                     {unitTypes.map(unit => (
//                       <MenuItem key={unit.id} value={unit.refName}>
//                         {unit.refName}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={newItems[row.item]?.includeChildren || false}
//                         onChange={(e) => handleNewItemChange(row.item, "includeChildren", e.target.checked)}
//                       />
//                     }
//                     label="Include Children"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={newItems[row.item]?.useBins || false}
//                         onChange={(e) => handleNewItemChange(row.item, "useBins", e.target.checked)}
//                       />
//                     }
//                     label="Use Bins"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={newItems[row.item]?.autoLeadTime || false}
//                         onChange={(e) => handleNewItemChange(row.item, "autoLeadTime", e.target.checked)}
//                       />
//                     }
//                     label="Auto Lead Time"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={newItems[row.item]?.autoPreferredStockLevel || false}
//                         onChange={(e) => handleNewItemChange(row.item, "autoPreferredStockLevel", e.target.checked)}
//                       />
//                     }
//                     label="Auto Preferred Stock Level"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={newItems[row.item]?.autoReorderPoint || false}
//                         onChange={(e) => handleNewItemChange(row.item, "autoReorderPoint", e.target.checked)}
//                       />
//                     }
//                     label="Auto Reorder Point"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={newItems[row.item]?.copyDescription || false}
//                         onChange={(e) => handleNewItemChange(row.item, "copyDescription", e.target.checked)}
//                       />
//                     }
//                     label="Copy Description"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={newItems[row.item]?.enforceminqtyinternally || false}
//                         onChange={(e) => handleNewItemChange(row.item, "enforceminqtyinternally", e.target.checked)}
//                       />
//                     }
//                     label="Enforce Min Qty Internally"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={newItems[row.item]?.isDropShipItem || false}
//                         onChange={(e) => handleNewItemChange(row.item, "isDropShipItem", e.target.checked)}
//                       />
//                     }
//                     label="Is Drop Ship Item"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={newItems[row.item]?.isHazmatItem || false}
//                         onChange={(e) => handleNewItemChange(row.item, "isHazmatItem", e.target.checked)}
//                       />
//                     }
//                     label="Is Hazmat Item"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={newItems[row.item]?.isInactive || false}
//                         onChange={(e) => handleNewItemChange(row.item, "isInactive", e.target.checked)}
//                       />
//                     }
//                     label="Is Inactive"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={newItems[row.item]?.isLotItem || false}
//                         onChange={(e) => handleNewItemChange(row.item, "isLotItem", e.target.checked)}
//                       />
//                     }
//                     label="Is Lot Item"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={newItems[row.item]?.isSerialItem || false}
//                         onChange={(e) => handleNewItemChange(row.item, "isSerialItem", e.target.checked)}
//                       />
//                     }
//                     label="Is Serial Item"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={newItems[row.item]?.isSpecialOrderItem || false}
//                         onChange={(e) => handleNewItemChange(row.item, "isSpecialOrderItem", e.target.checked)}
//                       />
//                     }
//                     label="Is Special Order Item"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={newItems[row.item]?.matchBillToReceipt || false}
//                         onChange={(e) => handleNewItemChange(row.item, "matchBillToReceipt", e.target.checked)}
//                       />
//                     }
//                     label="Match Bill to Receipt"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={newItems[row.item]?.offerSupport || false}
//                         onChange={(e) => handleNewItemChange(row.item, "offerSupport", e.target.checked)}
//                       />
//                     }
//                     label="Offer Support"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={newItems[row.item]?.roundUpAsComponent || false}
//                         onChange={(e) => handleNewItemChange(row.item, "roundUpAsComponent", e.target.checked)}
//                       />
//                     }
//                     label="Round Up As Component"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={newItems[row.item]?.seasonalDemand || false}
//                         onChange={(e) => handleNewItemChange(row.item, "seasonalDemand", e.target.checked)}
//                       />
//                     }
//                     label="Seasonal Demand"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={newItems[row.item]?.shipIndividually || false}
//                         onChange={(e) => handleNewItemChange(row.item, "shipIndividually", e.target.checked)}
//                       />
//                     }
//                     label="Ship Individually"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={newItems[row.item]?.trackLandedCost || false}
//                         onChange={(e) => handleNewItemChange(row.item, "trackLandedCost", e.target.checked)}
//                       />
//                     }
//                     label="Track Landed Cost"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={newItems[row.item]?.updateExistingTranAccounts || false}
//                         onChange={(e) => handleNewItemChange(row.item, "updateExistingTranAccounts", e.target.checked)}
//                       />
//                     }
//                     label="Update Existing Transaction Accounts"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={newItems[row.item]?.useMarginalRates || false}
//                         onChange={(e) => handleNewItemChange(row.item, "useMarginalRates", e.target.checked)}
//                       />
//                     }
//                     label="Use Marginal Rates"
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={() => createNewItem(row.item)}
//                     sx={{ mt: 2, alignSelf: 'flex-end' }}
//                   >
//                     Créer Item
//                   </Button>
//                 </Grid>
//               </Grid>
//             </CustomAccordionDetails>
//           </CustomAccordion>
//         ))}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="secondary">Annuler</Button>
//         <Button onClick={handleCreateBomRevision} color="primary" variant="contained" disabled={!isSaveEnabled}>
//           Enregistrer
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }


import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
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
  Grid,
  Autocomplete,
  TextareaAutosize,
  Box,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { styled } from '@mui/material/styles';
import { useSpring, animated } from '@react-spring/web'; // Pour des animations fluides

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Composant personnalisé pour la section expansible
const CustomExpandableSection = React.memo(({ row, expanded, onToggle, children, disabled }) => {
  const springProps = useSpring({
    height: expanded && !disabled ? 'auto' : 0,
    opacity: expanded && !disabled ? 1 : 0,
    config: { tension: 200, friction: 20 },
  });

  return (
    <div>
      <Box
        sx={{
          border: `1px solid ${theme => theme.palette.divider}`,
          '&:not(:last-child)': { borderBottom: 0 },
          width: '100%',
          cursor: disabled ? 'default' : 'pointer',
          opacity: disabled ? 0.5 : 1,
        }}
        onClick={!disabled ? onToggle : undefined}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
          <Box sx={{ display: 'flex', gap: 4 }}>
            <Typography sx={{ minWidth: '100px', maxWidth: '50px' }}>{row.item}</Typography>
            <Typography sx={{ minWidth: '100px', maxWidth: '50px' }}>
              {row.itemId || 'Item inexistant'}
            </Typography>
            <Typography sx={{ minWidth: '100px', maxWidth: '50px' }}>{row.bomQuantity}</Typography>
            <Typography sx={{ minWidth: '100px', maxWidth: '50px' }}>{row.revision_name}</Typography>
            <Typography sx={{ minWidth: '100px', maxWidth: '50px' }}>{row.order}</Typography>
          </Box>
          {!disabled && (
            <ArrowForwardIosSharpIcon
              sx={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
            />
          )}
        </Box>
      </Box>
      <animated.div style={springProps}>
        <Box sx={{ padding: 2, borderTop: '1px solid rgba(0, 0, 0, .125)' }}>
          {children}
        </Box>
      </animated.div>
    </div>
  );
});

export default function BomRevisionDialog({ open, onClose, revisionName, data, bomId, bomName }) {
  const [tableData, setTableData] = useState([]);
  const [memo, setMemo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [netSuiteItems, setNetSuiteItems] = useState({});
  const [newItems, setNewItems] = useState({});
  const [subitems, setSubitems] = useState([]);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const [isCreating, setIsCreating] = useState(false); // État de chargement pour "Créer Item"

  // Utiliser useRef pour suivre l'état le plus récent
  const newItemsRef = useRef({});

  // Définir unitTypes en premier pour éviter l'erreur d'initialisation
  const unitTypes = useMemo(() => [
    { id: "3", refName: "Longueur" },
    { id: "4", refName: "Poids" },
    { id: "2", refName: "Quantité" },
  ], []);

  // Listes statiques mémorisées à l'intérieur du composant
  const staticDepartments = useMemo(() => [
    { id: "1", name: "Production" },
    { id: "2", name: "Sales" },
    { id: "3", name: "Engineering" },
    { id: "4", name: "Quality Control" },
  ], []);

  const staticLocations = useMemo(() => [
    { id: "207", name: "ATELIER D'USINAGE GOBEIL" },
    { id: "208", name: "CNC PARADIS" },
    { id: "209", name: "CUSTOM ELECTRONICS INC" },
    { id: "112", name: "Entrepôt MCT 2425" },
    { id: "113", name: "Entrepôt MCT 2500-102" },
    { id: "114", name: "Entrepôt MCT Camion" },
    { id: "206", name: "Entrepôt Mindcore 91 Théodore-Viau" },
    { id: "210", name: "ENVITECH AUTOMATION" },
    { id: "211", name: "EPP METAL" },
    { id: "307", name: "EPP MÉTAL" },
    { id: "212", name: "ETS" },
    { id: "213", name: "FERROTECH" },
    { id: "102", name: "GS - Test WH location 1" },
    { id: "214", name: "LEVFAB" },
    { id: "216", name: "MDL ENERGIE" },
    { id: "217", name: "MEA TECH" },
    { id: "218", name: "MECTOR" },
    { id: "215", name: "METAL CN INC" },
    { id: "219", name: "MICRON" },
    { id: "220", name: "MSG INDUSTRIES" },
    { id: "308", name: "MÉTAL CN INC" },
    { id: "103", name: "Outsource Manufacturing" },
    { id: "105", name: "Outsource Manufacturing - Manufacturier Externe 1" },
    { id: "104", name: "Outsource Manufacturing - Manufacturier Externe 2" },
    { id: "221", name: "PLACAGE EXEL" },
    { id: "222", name: "PRECISION PLATING" },
    { id: "223", name: "PRO-STEL" },
    { id: "224", name: "RAPID PRECISION INDUSTRIES" },
    { id: "225", name: "REICAR" },
    { id: "226", name: "SCHOLER" },
    { id: "227", name: "SOLUTION USINAGE" },
    { id: "1", name: "Test Manufacturing location" },
    { id: "228", name: "TOURMAC" },
    { id: "229", name: "ULTIMAXS" },
    { id: "230", name: "USINAGE LAC MASSON" },
    { id: "231", name: "USINAGE PROTECH" },
    { id: "232", name: "USINATEK MR" },
  ], []);

  // Gestion des changements avec adaptation pour différents types de champs
  const handleNewItemChange = useCallback((itemName, field, value) => {
    setNewItems(prev => {
      const currentItem = prev[itemName] || {
        itemId: itemName,
        displayName: itemName,
        salesDescription: "",
        upcCode: "",
        itemType: { id: "InvtPart", refName: "InvtPart" },
        parent: null,
        department: null,
        location: null,
        subsidiary: { items: [{ id: "2" }] },
        unitsType: { id: "2", refName: "Quantité" },
        includeChildren: false,
        useBins: false,
        custitem_gs_desc_en: "",
        autoLeadTime: true,
        autoPreferredStockLevel: true,
        autoReorderPoint: true,
        copyDescription: false,
        enforceminqtyinternally: true,
        isDropShipItem: false,
        isHazmatItem: false,
        isInactive: false,
        isLotItem: false,
        isSerialItem: false,
        isSpecialOrderItem: false,
        matchBillToReceipt: false,
        offerSupport: false,
        roundUpAsComponent: false,
        seasonalDemand: false,
        shipIndividually: false,
        trackLandedCost: false,
        updateExistingTranAccounts: false,
        useMarginalRates: false,
      };

      let updatedValue = value;
      if (field === 'itemType') {
        updatedValue = { id: value, refName: value === "InvtPart" ? "InvtPart" : value === "Assembly" ? "Assembly" : "NonInvtPart" };
      } else if (['department', 'location', 'parent'].includes(field)) {
        updatedValue = value ? { id: value?.id || value } : null;
      } else if (field === 'subsidiary') {
        updatedValue = { items: [{ id: value || "2" }] };
      } else if (field === 'unitsType') {
        updatedValue = value ? { id: unitTypes.find(u => u.refName === value)?.id || "2", refName: value } : { id: "2", refName: "Quantité" };
      } else if (typeof value === 'boolean') {
        updatedValue = value;
      } else if (typeof value === 'string' || value === null) {
        updatedValue = value;
      }

      console.log(`Updating ${field} for ${itemName} with value:`, updatedValue);
      const newState = {
        ...prev,
        [itemName]: {
          ...currentItem,
          [field]: updatedValue,
        },
      };
      newItemsRef.current = newState; // Mettre à jour la référence avec le nouvel état
      return newState;
    });
  }, [unitTypes]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [netSuiteItemsResp, subitemsResp] = await Promise.all([
          axios.get("http://localhost:5000/api/suiteql/items"),
          axios.get("http://localhost:5000/api/suiteql/subitems"),
        ]);

        const itemsArray = netSuiteItemsResp.data.items || [];
        const itemsMap = {};
        itemsArray.forEach(item => {
          itemsMap[item.displayname] = {
            id: item.id,
            revision: item.revision_name || "Pas de révision",
          };
        });
        setNetSuiteItems(itemsMap);

        const subitemsData = subitemsResp.data.items || [];
        setSubitems(subitemsData);
      } catch (error) {
        console.error("Erreur lors du chargement initial des données:", error);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (data.length > 0 && revisionName) {
      setMemo("");
      setStartDate("");
      setEndDate("");
      const filteredData = data
        .filter((row) => row[revisionName + " QTY."] !== "-" && row[revisionName + " QTY."] !== 0)
        .map((row, index) => {
          const itemName = row["PART NUMBER"] || "";
          const itemData = netSuiteItems[itemName] || null;
          if (!itemData && itemName) {
            setNewItems(prev => ({
              ...prev,
              [itemName]: {
                itemId: itemName,
                displayName: itemName,
                salesDescription: "",
                upcCode: "",
                itemType: { id: "InvtPart", refName: "InvtPart" },
                parent: null,
                department: null,
                location: null,
                subsidiary: { items: [{ id: "2" }] },
                unitsType: { id: "2", refName: "Quantité" },
                includeChildren: false,
                useBins: false,
                custitem_gs_desc_en: "",
                autoLeadTime: true,
                autoPreferredStockLevel: true,
                autoReorderPoint: true,
                copyDescription: false,
                enforceminqtyinternally: true,
                isDropShipItem: false,
                isHazmatItem: false,
                isInactive: false,
                isLotItem: false,
                isSerialItem: false,
                isSpecialOrderItem: false,
                matchBillToReceipt: false,
                offerSupport: false,
                roundUpAsComponent: false,
                seasonalDemand: false,
                shipIndividually: false,
                trackLandedCost: false,
                updateExistingTranAccounts: false,
                useMarginalRates: false,
              },
            }));
          }
          const order = row.order || index + 1;
          return {
            id: `item-${itemName}-${order}-${index}`,
            item: itemName,
            itemId: itemData ? itemData.id : null,
            revision_name: itemData ? itemData.revision : "Pas de révision",
            bomQuantity: row[revisionName + " QTY."],
            order,
          };
        })
        .sort((a, b) => a.order - b.order);
      setTableData(filteredData);
      setIsSaveEnabled(filteredData.every(row => row.itemId !== null)); // Initialisation correcte
    }
  }, [data, revisionName, netSuiteItems]);

  const createNewItem = useCallback(async (itemName) => {
    const itemData = newItemsRef.current[itemName] || newItems[itemName];
    if (!itemData || netSuiteItems[itemName]?.id || isCreating) {
      return; // Ne rien faire si l'item existe, est en cours de création, ou n'a pas de données
    }
    setIsCreating(true); // Activer le chargement
    try {
      const payload = {
        autoLeadTime: itemData.autoLeadTime,
        autoPreferredStockLevel: itemData.autoPreferredStockLevel,
        autoReorderPoint: itemData.autoReorderPoint,
        copyDescription: itemData.copyDescription,
        custitem_gs_desc_en: itemData.custitem_gs_desc_en || "",
        displayName: itemData.displayName,
        enforceminqtyinternally: itemData.enforceminqtyinternally,
        includeChildren: itemData.includeChildren,
        isDropShipItem: itemData.isDropShipItem,
        isHazmatItem: itemData.isHazmatItem,
        isInactive: itemData.isInactive,
        isLotItem: itemData.isLotItem,
        isSerialItem: itemData.isSerialItem,
        isSpecialOrderItem: itemData.isSpecialOrderItem,
        itemId: itemData.itemId,
        itemType: itemData.itemType,
        matchBillToReceipt: itemData.matchBillToReceipt,
        offerSupport: itemData.offerSupport,
        roundUpAsComponent: itemData.roundUpAsComponent,
        salesDescription: itemData.salesDescription || "",
        seasonalDemand: itemData.seasonalDemand,
        shipIndividually: itemData.shipIndividually,
        trackLandedCost: itemData.trackLandedCost,
        unitsType: itemData.unitsType,
        updateExistingTranAccounts: itemData.updateExistingTranAccounts,
        useBins: itemData.useBins,
        useMarginalRates: itemData.useMarginalRates,
        subsidiary: itemData.subsidiary,
        location: itemData.location ? { id: itemData.location.id } : null,
        department: itemData.department ? { id: itemData.department.id } : null,
        parent: itemData.parent ? { id: itemData.parent.id } : null,
        upcCode: itemData.upcCode || "",
      };

      console.log("Item data from newItemsRef:", newItemsRef.current[itemName]);
      console.log("Item data sent:", payload);
      const response = await axios.post("http://localhost:5000/api/item/inventoryItem", payload);
      const newItemId = response.data.id;

      // Mettre à jour netSuiteItems et tableData avec le nouvel itemId
      setNetSuiteItems(prev => ({
        ...prev,
        [itemName]: { id: newItemId, revision: "N/A" },
      }));
      setNewItems(prev => {
        const { [itemName]: _, ...rest } = prev;
        return rest;
      });
      setTableData(prev =>
        prev.map(row =>
          row.item === itemName ? { ...row, itemId: newItemId } : row
        )
      );

      // Recharger les données depuis NetSuite pour actualiser tableData
      const updatedNetSuiteItemsResp = await axios.get("http://localhost:5000/api/suiteql/items");
      const updatedItemsArray = updatedNetSuiteItemsResp.data.items || [];
      const updatedItemsMap = {};
      updatedItemsArray.forEach(item => {
        updatedItemsMap[item.displayname] = {
          id: item.id,
          revision: item.revision_name || "Pas de révision",
        };
      });
      setNetSuiteItems(updatedItemsMap);

      const updatedTableData = data
        .filter((row) => row[revisionName + " QTY."] !== "-" && row[revisionName + " QTY."] !== 0)
        .map((row, index) => {
          const itemName = row["PART NUMBER"] || "";
          const itemData = updatedItemsMap[itemName] || null;
          const order = row.order || index + 1;
          return {
            id: `item-${itemName}-${order}-${index}`,
            item: itemName,
            itemId: itemData ? itemData.id : null,
            revision_name: itemData ? itemData.revision : "Pas de révision",
            bomQuantity: row[revisionName + " QTY."],
            order,
          };
        })
        .sort((a, b) => a.order - b.order);
      setTableData(updatedTableData);
      setIsSaveEnabled(updatedTableData.every(row => row.itemId !== null));

      // Fermer le dialogue après la création
      onClose();
    } catch (error) {
      console.error(`Erreur lors de la création de l'item ${itemName}:`, error);
      alert(`Échec de la création de l'item ${itemName}: ${error.response?.data?.detail || error.message}`);
    } finally {
      setIsCreating(false); // Désactiver le chargement après la requête
    }
  }, [netSuiteItems, tableData, data, revisionName, onClose]);

  const fetchBomIdByName = useCallback(async (bomName) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/bom/search?name=${encodeURIComponent(bomName)}`);
      return response.data.id;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'ID pour BOM ${bomName}:`, error);
      return null;
    }
  }, []);

  const handleCreateBomRevision = useCallback(async () => {
    if (!revisionName || !startDate || !endDate) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    let effectiveBomId = bomId;
    if (!effectiveBomId) {
      effectiveBomId = await fetchBomIdByName(bomName);
      if (!effectiveBomId) {
        alert(`Impossible de récupérer l'ID du BOM "${bomName}".`);
        return;
      }
    }

    const filteredItems = tableData.map((row, index) => {
      const itemData = netSuiteItems[row.item] || (row.itemId ? { id: row.itemId } : null);
      return {
        item: itemData ? { id: itemData.id, refName: row.item } : null,
        bomquantity: parseInt(row.bomQuantity, 10),
        lineSequenceNumber: row.order,
        custrecord_mc_ordre: row.order,
      };
    });

    const bomRevisionData = {
      billOfMaterials: { id: effectiveBomId },
      name: revisionName,
      memo,
      effectiveStartDate: startDate,
      effectiveEndDate: endDate,
      isInactive: false,
      component: { items: filteredItems },
    };

    try {
      console.log("Données envoyées à NetSuite :", JSON.stringify(bomRevisionData, null, 2));
      const response = await fetch("http://localhost:5000/api/bom-revision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bomRevisionData),
      });

      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      const result = await response.json();
      alert(`BOM Revision créée avec succès: ${bomRevisionData.name}`);
      onClose();
    } catch (error) {
      console.error("Erreur lors de la création de la BOM Revision:", error);
      alert("Échec de la création de la BOM Revision.");
    }
  }, [revisionName, startDate, endDate, bomId, bomName, tableData, netSuiteItems]);

  const handleToggleExpand = useCallback((itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  }, []);

  return (
    <Dialog open={open} TransitionComponent={Transition} keepMounted onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Configuration de la révision {revisionName}</DialogTitle>
      <DialogContent>
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

        {/* Caption améliorée */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            padding: '12px 16px',
            backgroundColor: '#f5f5f5',
            borderBottom: '2px solid #e0e0e0',
            marginLeft: '0px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <Box sx={{ display: 'flex', gap: 4 }}>
            <Typography
              sx={{
                minWidth: '100px',
                maxWidth: '50px',
                fontWeight: 'bold',
                color: '#1976d2',
                textAlign: 'center',
              }}
            >
              Part Number
            </Typography>
            <Typography
              sx={{
                minWidth: '100px',
                maxWidth: '50px',
                fontWeight: 'bold',
                color: '#1976d2',
                textAlign: 'center',
              }}
            >
              Item ID
            </Typography>
            <Typography
              sx={{
                minWidth: '100px',
                maxWidth: '50px',
                fontWeight: 'bold',
                color: '#1976d2',
                textAlign: 'center',
              }}
            >
              Qte
            </Typography>
            <Typography
              sx={{
                minWidth: '100px',
                maxWidth: '50px',
                fontWeight: 'bold',
                color: '#1976d2',
                textAlign: 'center',
              }}
            >
              Révision
            </Typography>
            <Typography
              sx={{
                minWidth: '100px',
                maxWidth: '50px',
                fontWeight: 'bold',
                color: '#1976d2',
                textAlign: 'center',
              }}
            >
              Ordre
            </Typography>
          </Box>
        </Box>

        {tableData.map((row) => (
          row.itemId ? (
            // Ligne statique pour les items existants
            <Box
              key={row.id}
              sx={{
                border: `1px solid ${theme => theme.palette.divider}`,
                '&:not(:last-child)': { borderBottom: 0 },
                width: '100%',
                padding: '8px 0',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '0 16px' }}>
                <Box sx={{ display: 'flex', gap: 4 }}>
                  <Typography sx={{ minWidth: '100px', maxWidth: '50px' }}>{row.item}</Typography>
                  <Typography sx={{ minWidth: '100px', maxWidth: '50px' }}>{row.itemId}</Typography>
                  <Typography sx={{ minWidth: '100px', maxWidth: '50px' }}>{row.bomQuantity}</Typography>
                  <Typography sx={{ minWidth: '100px', maxWidth: '50px' }}>{row.revision_name}</Typography>
                  <Typography sx={{ minWidth: '100px', maxWidth: '50px' }}>{row.order}</Typography>
                </Box>
              </Box>
            </Box>
          ) : (
            // Section expansible pour les items inexistants
            <CustomExpandableSection
              key={row.id}
              row={row}
              expanded={!!expandedItems[row.id]}
              onToggle={() => handleToggleExpand(row.id)}
              disabled={false} // Peut être ajusté si nécessaire
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Select
                    fullWidth
                    value={newItems[row.item]?.itemType?.id || "InvtPart"}
                    onChange={(e) => handleNewItemChange(row.item, "itemType", { id: e.target.value, refName: e.target.value === "InvtPart" ? "InvtPart" : e.target.value === "Assembly" ? "Assembly" : "NonInvtPart" })}
                    label="Item Type"
                  >
                    <MenuItem value="InvtPart">Inventory Item</MenuItem>
                    <MenuItem value="Assembly">Assembly Item</MenuItem>
                    <MenuItem value="NonInvtPart">Non-Inventory Purchase Item</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Item Name/Number (Item ID)"
                    value={newItems[row.item]?.itemId || ""}
                    onChange={(e) => handleNewItemChange(row.item, "itemId", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Display Name/Code (Display Name)"
                    value={newItems[row.item]?.displayName || ""}
                    onChange={(e) => handleNewItemChange(row.item, "displayName", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ position: 'relative', maxHeight: '120px', overflowY: 'auto' }}>
                    <TextareaAutosize
                      minRows={3}
                      maxRows={3}
                      placeholder="Description (en français)"
                      value={newItems[row.item]?.salesDescription || ""}
                      onChange={(e) => handleNewItemChange(row.item, "salesDescription", e.target.value)}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ position: 'relative', maxHeight: '120px', overflowY: 'auto' }}>
                    <TextareaAutosize
                      minRows={3}
                      maxRows={3}
                      placeholder="Description (en anglais)"
                      value={newItems[row.item]?.custitem_gs_desc_en || ""}
                      onChange={(e) => handleNewItemChange(row.item, "custitem_gs_desc_en", e.target.value)}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="UPC Code"
                    value={newItems[row.item]?.upcCode || ""}
                    onChange={(e) => handleNewItemChange(row.item, "upcCode", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Autocomplete
                    fullWidth
                    options={subitems}
                    getOptionLabel={(option) => option.itemid || ""}
                    value={subitems.find(item => item.id === (newItems[row.item]?.parent?.id || null)) || null}
                    onChange={(e, value) => handleNewItemChange(row.item, "parent", value ? { id: value.id } : null)}
                    renderInput={(params) => <TextField {...params} label="Subitem of (Parent)" />}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Autocomplete
                    fullWidth
                    options={staticDepartments}
                    getOptionLabel={(option) => option.name || ""}
                    value={staticDepartments.find(dept => dept.id === (newItems[row.item]?.department?.id || null)) || null}
                    onChange={(e, value) => handleNewItemChange(row.item, "department", value ? { id: value.id } : null)}
                    renderInput={(params) => <TextField {...params} label="Department" />}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Autocomplete
                    fullWidth
                    options={staticLocations}
                    getOptionLabel={(option) => option.name || ""}
                    value={staticLocations.find(loc => loc.id === (newItems[row.item]?.location?.id || null)) || null}
                    onChange={(e, value) => handleNewItemChange(row.item, "location", value ? { id: value.id } : null)}
                    renderInput={(params) => <TextField {...params} label="Location" />}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Select
                    fullWidth
                    value={(newItems[row.item]?.subsidiary?.items[0]?.id) || "2"}
                    onChange={(e) => handleNewItemChange(row.item, "subsidiary", { items: [{ id: e.target.value }] })}
                    label="Subsidiary"
                  >
                    <MenuItem value="1">Parent Company</MenuItem>
                    <MenuItem value="2">Mindcore</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Select
                    fullWidth
                    value={newItems[row.item]?.unitsType?.refName || "Quantité"}
                    onChange={(e) => {
                      const selectedUnit = unitTypes.find(unit => unit.refName === e.target.value);
                      handleNewItemChange(row.item, "unitsType", selectedUnit || { id: "2", refName: "Quantité" });
                    }}
                    label="Primary Units Type"
                  >
                    {unitTypes.map(unit => (
                      <MenuItem key={unit.id} value={unit.refName}>
                        {unit.refName}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={newItems[row.item]?.includeChildren || false}
                        onChange={(e) => handleNewItemChange(row.item, "includeChildren", e.target.checked)}
                      />
                    }
                    label="Include Children"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={newItems[row.item]?.useBins || false}
                        onChange={(e) => handleNewItemChange(row.item, "useBins", e.target.checked)}
                      />
                    }
                    label="Use Bins"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={newItems[row.item]?.autoLeadTime || false}
                        onChange={(e) => handleNewItemChange(row.item, "autoLeadTime", e.target.checked)}
                      />
                    }
                    label="Auto Lead Time"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={newItems[row.item]?.autoPreferredStockLevel || false}
                        onChange={(e) => handleNewItemChange(row.item, "autoPreferredStockLevel", e.target.checked)}
                      />
                    }
                    label="Auto Preferred Stock Level"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={newItems[row.item]?.autoReorderPoint || false}
                        onChange={(e) => handleNewItemChange(row.item, "autoReorderPoint", e.target.checked)}
                      />
                    }
                    label="Auto Reorder Point"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={newItems[row.item]?.copyDescription || false}
                        onChange={(e) => handleNewItemChange(row.item, "copyDescription", e.target.checked)}
                      />
                    }
                    label="Copy Description"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={newItems[row.item]?.enforceminqtyinternally || false}
                        onChange={(e) => handleNewItemChange(row.item, "enforceminqtyinternally", e.target.checked)}
                      />
                    }
                    label="Enforce Min Qty Internally"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={newItems[row.item]?.isDropShipItem || false}
                        onChange={(e) => handleNewItemChange(row.item, "isDropShipItem", e.target.checked)}
                      />
                    }
                    label="Is Drop Ship Item"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={newItems[row.item]?.isHazmatItem || false}
                        onChange={(e) => handleNewItemChange(row.item, "isHazmatItem", e.target.checked)}
                      />
                    }
                    label="Is Hazmat Item"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={newItems[row.item]?.isInactive || false}
                        onChange={(e) => handleNewItemChange(row.item, "isInactive", e.target.checked)}
                      />
                    }
                    label="Is Inactive"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={newItems[row.item]?.isLotItem || false}
                        onChange={(e) => handleNewItemChange(row.item, "isLotItem", e.target.checked)}
                      />
                    }
                    label="Is Lot Item"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={newItems[row.item]?.isSerialItem || false}
                        onChange={(e) => handleNewItemChange(row.item, "isSerialItem", e.target.checked)}
                      />
                    }
                    label="Is Serial Item"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={newItems[row.item]?.isSpecialOrderItem || false}
                        onChange={(e) => handleNewItemChange(row.item, "isSpecialOrderItem", e.target.checked)}
                      />
                    }
                    label="Is Special Order Item"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={newItems[row.item]?.matchBillToReceipt || false}
                        onChange={(e) => handleNewItemChange(row.item, "matchBillToReceipt", e.target.checked)}
                      />
                    }
                    label="Match Bill to Receipt"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={newItems[row.item]?.offerSupport || false}
                        onChange={(e) => handleNewItemChange(row.item, "offerSupport", e.target.checked)}
                      />
                    }
                    label="Offer Support"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={newItems[row.item]?.roundUpAsComponent || false}
                        onChange={(e) => handleNewItemChange(row.item, "roundUpAsComponent", e.target.checked)}
                      />
                    }
                    label="Round Up As Component"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={newItems[row.item]?.seasonalDemand || false}
                        onChange={(e) => handleNewItemChange(row.item, "seasonalDemand", e.target.checked)}
                      />
                    }
                    label="Seasonal Demand"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={newItems[row.item]?.shipIndividually || false}
                        onChange={(e) => handleNewItemChange(row.item, "shipIndividually", e.target.checked)}
                      />
                    }
                    label="Ship Individually"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={newItems[row.item]?.trackLandedCost || false}
                        onChange={(e) => handleNewItemChange(row.item, "trackLandedCost", e.target.checked)}
                      />
                    }
                    label="Track Landed Cost"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={newItems[row.item]?.updateExistingTranAccounts || false}
                        onChange={(e) => handleNewItemChange(row.item, "updateExistingTranAccounts", e.target.checked)}
                      />
                    }
                    label="Update Existing Transaction Accounts"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={newItems[row.item]?.useMarginalRates || false}
                        onChange={(e) => handleNewItemChange(row.item, "useMarginalRates", e.target.checked)}
                      />
                    }
                    label="Use Marginal Rates"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => createNewItem(row.item)}
                    sx={{ mt: 2, alignSelf: 'flex-end', position: 'relative' }}
                    disabled={isCreating}
                  >
                    {isCreating ? <CircularProgress size={24} /> : "Créer Item"}
                  </Button>
                </Grid>
              </Grid>
            </CustomExpandableSection>
          )
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Annuler</Button>
        <Button onClick={handleCreateBomRevision} color="primary" variant="contained" disabled={!isSaveEnabled}>
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
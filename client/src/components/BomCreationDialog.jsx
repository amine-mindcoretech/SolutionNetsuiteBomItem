// BomCreationDialog.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function BomCreationDialog({ open, onClose, onCreate, bomName }) {
  const [name, setName] = useState(bomName || "");
  const [availableForAllAssemblies, setAvailableForAllAssemblies] = useState(true);
  const [availableForAllLocations, setAvailableForAllLocations] = useState(true);
  const [memo, setMemo] = useState("");
  const [subsidiaryId, setSubsidiaryId] = useState("2"); // Par défaut "Mindcore" (ID 2)

  useEffect(() => {
    setName(bomName || "");
  }, [bomName]);

  const handleSubmit = () => {
    const bomData = {
      name,
      availableForAllAssemblies,
      availableForAllLocations,
      memo,
      subsidiary: {
        items: [
          {
            id: subsidiaryId,
          },
        ],
      },
    };
    onCreate(bomData);
    onClose();
  };

  return (
    <Dialog open={open} TransitionComponent={Transition} keepMounted onClose={onClose}>
      <DialogTitle>Créer un BOM</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
          Configurez les paramètres du BOM :
        </Typography>
        <TextField
          fullWidth
          label="Nom du BOM"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value.replace(/\r/g, ''))} // Nettoie les retours chariot
          sx={{ marginBottom: 2 }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={availableForAllAssemblies}
              onChange={(e) => setAvailableForAllAssemblies(e.target.checked)}
            />
          }
          label="Available For All Assemblies"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={availableForAllLocations}
              onChange={(e) => setAvailableForAllLocations(e.target.checked)}
            />
          }
          label="Available For All Locations"
        />
        <TextField
          fullWidth
          label="Memo"
          multiline
          rows={3}
          variant="outlined"
          value={memo}
          onChange={(e) => setMemo(e.target.value.replace(/\r/g, ''))} // Nettoie les retours chariot
          sx={{ marginTop: 2, marginBottom: 2 }}
        />
        <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
          Subsidiary :
        </Typography>
        <Select
          fullWidth
          value={subsidiaryId}
          onChange={(e) => setSubsidiaryId(e.target.value)}
          sx={{ marginBottom: 2 }}
        >
          <MenuItem value="1">Parent Company</MenuItem>
          <MenuItem value="2">Mindcore</MenuItem>
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Annuler</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">Créer</Button>
      </DialogActions>
    </Dialog>
  );
}
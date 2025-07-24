import React from "react";
import { Box, TextField, Grid, Button } from "@mui/material";

export default function DatesImportantesForm({ formData, setFormData, handleSave, handleReset }) {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: "#f9f9f9" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Date de Naissance" name="dateNaissance" type="date" InputLabelProps={{ shrink: true }} value={formData.dateNaissance} onChange={handleChange} margin="dense" />
          <TextField fullWidth label="Date d'Embauche" name="dateEmbauche" type="date" InputLabelProps={{ shrink: true }} value={formData.dateEmbauche} onChange={handleChange} margin="dense" />
          <TextField fullWidth label="Date de Cessation" name="dateCessation" type="date" InputLabelProps={{ shrink: true }} value={formData.dateCessation} onChange={handleChange} margin="dense" />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Fin de Probation 1" name="dateProbation1" type="date" InputLabelProps={{ shrink: true }} value={formData.dateProbation1} onChange={handleChange} margin="dense" />
          <TextField fullWidth label="Fin de Probation 2" name="dateProbation2" type="date" InputLabelProps={{ shrink: true }} value={formData.dateProbation2} onChange={handleChange} margin="dense" />
          <TextField fullWidth label="Dernière Évaluation" name="evaluationSalariale" type="date" InputLabelProps={{ shrink: true }} value={formData.evaluationSalariale} onChange={handleChange} margin="dense" />
        </Grid>
      </Grid>
      {/* <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button variant="contained" color="secondary" onClick={handleReset} sx={{ mr: 2 }}>
          Annuler
        </Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Enregistrer
        </Button>
      </Box> */}
    </Box>
  );
}

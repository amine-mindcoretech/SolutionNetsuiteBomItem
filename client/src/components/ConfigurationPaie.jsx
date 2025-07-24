import React from "react";
import { Box, TextField, MenuItem, Button, Grid } from "@mui/material";

export default function ConfigurationPaie({ formData, setFormData, handleSave, handleReset }) {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: "#f9f9f9" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Code CC" name="codeCc" value={formData.codeCc} onChange={handleChange} margin="dense" />
          <TextField fullWidth label="Salaire Par Défaut" name="salaireParDefaut" type="number" value={formData.salaireParDefaut} onChange={handleChange} margin="dense" />
          <TextField fullWidth label="Type de Rémunération" name="typeRemuneration" value={formData.typeRemuneration} onChange={handleChange} margin="dense" />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Numéro RAMQ" name="numeroRamq" value={formData.numeroRamq} onChange={handleChange} margin="dense" />
          <TextField fullWidth label="Syndicat Local" name="syndicatLocal" value={formData.syndicatLocal} onChange={handleChange} margin="dense" />
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

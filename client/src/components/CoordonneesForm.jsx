//CoordonneesForm.jsx
import React from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
} from "@mui/material";

export default function CoordonneesForm({ formData, setFormData, handleSave, handleReset, errors }) {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: "#f9f9f9" }}>
      <Grid container spacing={3}>
        {/* Colonne Gauche */}
        <Grid item xs={12} md={6}>
          <TextField fullWidth required label="Nom" name="nom" value={formData.nom || ""} onChange={handleChange} margin="dense" error={!!errors.nom} helperText={errors.nom} />
          <TextField fullWidth required label="Prénom" name="prenom" value={formData.prenom || ""} onChange={handleChange} margin="dense" error={!!errors.prenom} helperText={errors.prenom} />
          <TextField
            fullWidth
            label="Adresse"
            name="adresse"
            value={formData.adresse || ""}
            onChange={handleChange}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Ville"
            name="ville"
            value={formData.ville || ""}
            onChange={handleChange}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Province"
            name="province"
            value={formData.province || ""}
            onChange={handleChange}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Pays"
            name="pays"
            value={formData.pays || ""}
            onChange={handleChange}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Code Postal"
            name="codePostal"
            value={formData.codePostal || ""}
            onChange={handleChange}
            margin="dense"
          />
        </Grid>

        {/* Colonne Droite */}
        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.actif || false}
                onChange={(e) => setFormData({ ...formData, actif: e.target.checked })}
              />
            }
            label="Actif"
          />
          <TextField
            fullWidth
            select
            label="Sexe"
            name="sexe"
            value={formData.sexe || ""}
            onChange={handleChange}
            margin="dense"
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Femelle">Femelle</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Téléphone"
            name="telephone"
            value={formData.telephone || ""}
            onChange={handleChange}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Téléphone Portable"
            name="telephonePortable"
            value={formData.telephonePortable || ""}
            onChange={handleChange}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Compagnie Téléphone"
            name="compagnieTelephone"
            value={formData.compagnieTelephone || ""}
            onChange={handleChange}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Langue"
            name="langue"
            value={formData.langue || ""}
            onChange={handleChange}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Adresse Courriel"
            name="adresseCourriel"
            value={formData.adresseCourriel || ""}
            onChange={handleChange}
            error={!!errors.prenom}
            helperText={errors.prenom}
            margin="dense"
          />
        </Grid>
      </Grid>
    </Box>
  );
}

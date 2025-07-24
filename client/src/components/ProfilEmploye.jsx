//ProfilEmploye.jsx
import React from "react";
import { Box, TextField, MenuItem, Grid, Autocomplete } from "@mui/material";

export default function ProfilEmploye({ formData, setFormData, errors }) {
  const securityProfiles = [
    "Employé (Édition) / BOM",
    "Employé (Lecture) / BOM",
    "Employé (Édition) / Révision",
    "Employé (Lecture) / Révision",
    "Employé (Édition) / Assembly",
    "Employé (Lecture) / Assembly",
    "Employé (Rapport) / Projets",
    "Employé (Édition) / Utilisateurs",
    "Employé (Lecture) / Utilisateurs",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMultiSelectChange = (event, newValue) => {
    setFormData({ ...formData, profilSecurite: newValue });
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: "#f9f9f9" }}>
      <Grid container spacing={3}>
        {/* Colonne Gauche */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="Matricule"
            name="matricule"
            value={formData.matricule || ""}
            onChange={handleChange}
            margin="dense"
            error={!!errors.matricule}
            helperText={errors.matricule}
          />
          <TextField
            fullWidth
            required
            label="Poste"
            name="poste"
            value={formData.poste || ""}
            onChange={handleChange}
            margin="dense"
          />
          <TextField
            fullWidth
            required
            select
            label="Entreprise"
            name="entreprise"
            value={formData.entreprise || ""}
            onChange={handleChange}
            margin="dense"
            error={!!errors.entreprise}
            helperText={errors.entreprise}
          >
            <MenuItem value="Mindcore Technologies">Mindcore Technologies</MenuItem>
          </TextField>
          <TextField
            fullWidth
            required
            select
            label="Département"
            name="departement"
            value={formData.departement || ""}
            onChange={handleChange}
            margin="dense"
            error={!!errors.departement}
            helperText={errors.departement}
          >
            <MenuItem value="RH">RH</MenuItem>
            <MenuItem value="Ingénierie">Ingénierie</MenuItem>
            <MenuItem value="R&D">R&D</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Superviseur Matricule"
            name="superviseur_matricule"
            value={formData.superviseur_matricule || ""}
            onChange={handleChange}
            margin="dense"
          />
          <Autocomplete
            multiple
            options={securityProfiles}
            getOptionLabel={(option) => option}
            value={formData.profilSecurite || []}
            onChange={handleMultiSelectChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Profil de sécurité"
                placeholder="Sélectionnez"
                margin="dense"
                error={!!errors.profilSecurite}
                helperText={errors.profilSecurite}
              />
            )}
          />
        </Grid>

        {/* Colonne Droite */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="Login"
            name="login"
            value={formData.login || ""}
            onChange={handleChange}
            margin="dense"
            error={!!errors.login}
            helperText={errors.login}
          />
          <TextField
            fullWidth
            required
            type="password"
            label="Mot de passe"
            name="password"
            value={formData.password || ""}
            onChange={handleChange}
            margin="dense"
            error={!!errors.password}
            helperText={errors.password}
          />
          <TextField
            fullWidth
            required
            type="password"
            label="Confirmation du mot de passe"
            name="confirmPassword"
            value={formData.confirmPassword || ""}
            onChange={handleChange}
            margin="dense"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />
          <TextField
            fullWidth
            required
            label="Consumer Key"
            name="consumerKey"
            value={formData.consumerKey || ""}
            onChange={handleChange}
            margin="dense"
            error={!!errors.consumerKey}
            helperText={errors.consumerKey}
          />
          <TextField
            fullWidth
            required
            label="Consumer Secret"
            name="consumerSecret"
            value={formData.consumerSecret || ""}
            onChange={handleChange}
            margin="dense"
            error={!!errors.consumerSecret}
            helperText={errors.consumerSecret}
          />
          <TextField
            fullWidth
            required
            label="Access Token"
            name="accessToken"
            value={formData.accessToken || ""}
            onChange={handleChange}
            margin="dense"
            error={!!errors.accessToken}
            helperText={errors.accessToken}
          />
          <TextField
            fullWidth
            required
            label="Token Secret"
            name="tokenSecret"
            value={formData.tokenSecret || ""}
            onChange={handleChange}
            margin="dense"
            error={!!errors.tokenSecret}
            helperText={errors.tokenSecret}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

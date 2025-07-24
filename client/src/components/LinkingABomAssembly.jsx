//LinkingABomAssembly.jsx
import React, { useState } from "react";
import { Box, Button, Typography, Stepper, Step, StepLabel, CircularProgress } from "@mui/material";
import AssemblySelection from "../components/AssemblySelection"; // Sélection d'un Assembly
import BomSelection from "../components/BomSelection"; // Sélection d'un BOM
import axios from "axios";

const steps = ["Sélection d'un Assembly", "Sélection d'un BOM", "Confirmation"];

export default function LinkingABomAssembly() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedAssembly, setSelectedAssembly] = useState(null);
  const [selectedBom, setSelectedBom] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleNext = async () => {
    if (activeStep === 0 && !selectedAssembly) {
      alert("Veuillez sélectionner un Assembly avant de continuer.");
      return;
    }
    if (activeStep === 1 && !selectedBom) {
      alert("Veuillez sélectionner un BOM avant de continuer.");
      return;
    }
    
    // Étape 3 : Envoi des données à NetSuite via ton backend
    if (activeStep === 2) {
      await handleSubmit();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // 🔹 Fonction pour envoyer les données au backend
  const handleSubmit = async () => {
    setLoadingSubmit(true);
    setSubmitMessage("");
    setIsError(false);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/bom-assembly", // 🔹 Appel au backend local
        {
          assemblyItemId: selectedAssembly.id,
          bomId: selectedBom.id
        }
      );

      if (response.data.status === "error") {
        // 🔹 Gestion de l'erreur spécifique "BoM is already attached to the assembly."
        setSubmitMessage(response.data.message);
        setIsError(true);
      } else {
        setSubmitMessage(response.data.message || "Liaison réussie !");
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }

    } catch (error) {
      console.error("Erreur lors de la liaison du BOM :", error);
      if (error.response && error.response.data && error.response.data.message) {
        setSubmitMessage(error.response.data.message);
      } else {
        setSubmitMessage("Erreur lors de l'enregistrement du BOM. Vérifiez NetSuite.");
      }
      setIsError(true);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div style={{ width: "100%", padding: "20px" }}>
      <Typography variant="h4" sx={{ marginBottom: "20px" }}>
        Liaison d’un BOM à un Assemblage
      </Typography>

      <Stepper activeStep={activeStep} sx={{ marginBottom: "20px" }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Étape 1 : Sélection de l'Assembly */}
      {activeStep === 0 && <AssemblySelection onSelect={setSelectedAssembly} />}

      {/* Étape 2 : Sélection du BOM */}
      {activeStep === 1 && <BomSelection onSelect={setSelectedBom} />}

      {/* Étape 3 : Confirmation */}
      {activeStep === 2 && (
        <Box>
          <Typography variant="h6">
            Confirmez l'association entre l'Assembly et le BOM :
          </Typography>
          <Typography>ID Assembly : {selectedAssembly?.id} - {selectedAssembly?.itemid}</Typography>
          <Typography>ID BOM : {selectedBom?.id} - {selectedBom?.name}</Typography>

          {loadingSubmit ? <CircularProgress /> : (
            <Typography color={isError ? "error" : "primary"}>
              {submitMessage}
            </Typography>
          )}
        </Box>
      )}

      {activeStep === steps.length ? (
        <Typography sx={{ mt: 2, mb: 1 }}>
          {isError ? submitMessage : "Toutes les étapes sont complétées - Liaison terminée."}
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
          <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
            Précédent
          </Button>
          <Box sx={{ flex: "1 1 auto" }} />
          <Button onClick={handleNext} disabled={loadingSubmit}>
            {activeStep === steps.length - 1 ? "Terminer" : "Suivant"}
          </Button>
        </Box>
      )}
    </div>
  );
}

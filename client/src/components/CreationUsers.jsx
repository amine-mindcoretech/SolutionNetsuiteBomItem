//CreationUsers.jsx
import React, { useState } from "react";
import {
    Box,
    Button,
    Paper,
    CircularProgress,
    AppBar, 
    Tabs, 
    Tab,
    Snackbar,
    Alert
  } from '@mui/material';
import PropTypes from "prop-types";
import CoordonneesForm from "./CoordonneesForm";
import DatesImportantesForm from "./DatesImportantesForm";
import ConfigurationPaie from "./ConfigurationPaie";
import ProfilEmploye from "./ProfilEmploye";
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default function CreationUsers() {
  const [value, setValue] = useState(0);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    adresse: "",
    app: "",
    telephonePortable: "",
    ville: "",
    province: "",
    pays: "",
    codePostal: "",
    actif: true,
    sexe: "",
    langue: "",
    telephone: "",
    telephone2: "",
    compagnieTelephone: "",
    contactUrgence1: "",
    contactUrgence2: "",
    adresseCourriel: "",
    adresseCourrielCorporative: "",
    dateNaissance: "",
    dateEmbauche: "",
    dateCessation: "",
    dateProbation1: "",
    dateProbation2: "",
    evaluationSalariale: "",
    codeCc: "",
    typeRemuneration: "",
    numeroRamq: "",
    syndicatLocal: "",
    regleTempsSupp: "",
    regleCorrection: "",
    regleException: "",
    regleFeriee: "",
    cumulatifBanques: "",
    salaireParDefaut: "",
    metier: "",
    competence: "",
    poste: "",
    position: "",
    typeDisponibilite: "",
    ordreStatut: "",
    codeHorodateur: "",
    profilSecurite: [],
    entreprise: "",
    departement: "",
    superviseur: "",
    login: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState({ open: false, type: "success", text: "" });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

 
  const validateFields = (currentStep) => {
    let newErrors = {};
    if (currentStep === 0) {
        if (!formData.nom?.trim()) newErrors.nom = "Nom requis";
        if (!formData.prenom?.trim()) newErrors.prenom = "Prénom requis";
        if (!formData.adresseCourriel?.trim()) newErrors.adresseCourriel = "adresse courriel requis";
    }
    if (currentStep === 3) {
        if (!formData.matricule?.trim()) newErrors.matricule = "Matricule requis";
        if (!formData.entreprise) newErrors.entreprise = "Entreprise requise";
        if (!formData.departement) newErrors.departement = "Département requis";
        if (!Array.isArray(formData.profilSecurite) || formData.profilSecurite.length === 0) {
        newErrors.profilSecurite = "Profil de sécurité requis";
        }
        if (!formData.login?.trim()) newErrors.login = "Login requis";
    
        if (!formData.password?.trim()) {
        newErrors.password = "Mot de passe requis";
        } else if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{12,}$/.test(formData.password)) {
        newErrors.password = "Doit contenir au moins 12 caractères, 1 majuscule et 1 caractère spécial";
        }
    
        if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
        }
    
        if (!formData.consumerKey?.trim()) newErrors.consumerKey = "Consumer Key requis";
        if (!formData.consumerSecret?.trim()) newErrors.consumerSecret = "Consumer Secret requis";
        if (!formData.accessToken?.trim()) newErrors.accessToken = "Access Token requis";
        if (!formData.tokenSecret?.trim()) newErrors.tokenSecret = "Token Secret requis";
    }
   
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleNext = () => {
    if (validateFields(value)) {
      setValue((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setValue((prev) => prev - 1);
  };

  const handleRegisterUser = async () => {
    if (!validateFields(3)) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'enregistrement");
      }

      setApiMessage({ open: true, type: "success", text: "Utilisateur créé avec succès !" });
      setFormData({
        nom: "",
        prenom: "",
        adresse: "",
        app: "",
        telephonePortable: "",
        ville: "",
        province: "",
        pays: "",
        codePostal: "",
        actif: true,
        sexe: "",
        langue: "",
        telephone: "",
        compagnieTelephone: "",
        adresseCourriel: "",
        dateNaissance: "",
        dateEmbauche: "",
        dateCessation: "",
        codeCc: "",
        typeRemuneration: "",
        numeroRamq: "",
        syndicatLocal: "",
        salaireParDefaut: "",
        metier: "",
        competence: "",
        poste: "",
        profilSecurite: [],
        entreprise: "",
        departement: "",
        superviseur: "",
        login: "",
        password: "",
        confirmPassword: "",
        consumerKey: "",
        consumerSecret: "",
        accessToken: "",
        tokenSecret: "",
      });
    } catch (error) {
      setApiMessage({ open: true, type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };
  const handleReset = () => {
    setFormData({
      nom: "",
      prenom: "",
      adresse: "",
      app: "",
      telephonePortable: "",
      ville: "",
      province: "",
      pays: "",
      codePostal: "",
      actif: true,
      sexe: "",
      langue: "",
      telephone: "",
      telephone2: "",
      compagnieTelephone: "",
      contactUrgence1: "",
      contactUrgence2: "",
      adresseCourriel: "",
      adresseCourrielCorporative: "",
      dateNaissance: "",
      dateEmbauche: "",
      dateCessation: "",
      dateProbation1: "",
      dateProbation2: "",
      evaluationSalariale: "",
      codeCc: "",
      typeRemuneration: "",
      numeroRamq: "",
      syndicatLocal: "",
      regleTempsSupp: "",
      regleCorrection: "",
      regleException: "",
      regleFeriee: "",
      cumulatifBanques: "",
      salaireParDefaut: "",
      metier: "",
      competence: "",
      poste: "",
      position: "",
      typeDisponibilite: "",
      ordreStatut: "",
      codeHorodateur: "",
      profilSecurite: [],
      entreprise: "",
      departement: "",
      superviseur: "",
      login: "",
      password: "",
      confirmPassword: "",
    });
  };
  const Item = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));
  

  return (
    <Box sx={{ width: "100%", backgroundColor: "#eeeee4" }}>
      <AppBar position="static" color="default">
        <Tabs value={value} onChange={(e, newValue) => setValue(newValue)} indicatorColor="primary" textColor="primary">
          <Tab label="Coordonnées" />
          <Tab label="Dates Importantes" />
          <Tab label="Configuration de Paie" />
          <Tab label="Profil de l'Employé" />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} dir={theme.direction}>
        <CoordonneesForm formData={formData} setFormData={setFormData}  handleReset={handleReset} errors={errors}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <DatesImportantesForm formData={formData} setFormData={setFormData}  handleReset={handleReset} errors={errors}/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ConfigurationPaie formData={formData} setFormData={setFormData}  handleReset={handleReset} errors={errors}/>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <ProfilEmploye formData={formData} setFormData={setFormData}  handleReset={handleReset} errors={errors} />
      </TabPanel>
      <Box sx={{ display: "flex", justifyContent: "space-between", p: 3 }}>
        {value > 0 && <Button variant="contained" color="secondary" onClick={handlePrev}>Précédent</Button>}
        {value < 3 ? (
          <Button variant="contained" color="primary" onClick={handleNext}>Suivant</Button>
        ) : (
          <Button variant="contained" color="success" onClick={handleRegisterUser} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Enregistrer"}
          </Button>
        )}
      </Box>

      <Snackbar open={apiMessage.open} autoHideDuration={6000} onClose={() => setApiMessage({ ...apiMessage, open: false })}>
        <Alert severity={apiMessage.type}>{apiMessage.text}</Alert>
      </Snackbar>
    </Box>
  );
}

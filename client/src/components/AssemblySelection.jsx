//AssemblySelection.jsx
import React, { useEffect, useState } from "react";
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Radio, CircularProgress, Typography, TablePagination
} from "@mui/material";
import axios from "axios";
import { useSearch } from "../context/SearchContext"; // Importation du contexte de recherche

export default function AssemblySelection({ onSelect }) {
  const { searchTerm } = useSearch(); // Récupérer la valeur de recherche
  const [assemblies, setAssemblies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssembly, setSelectedAssembly] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    axios.get("http://localhost:5000/api/assemblies/assemblies")
      .then(response => {
        setAssemblies(response.data.items);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des assemblies :", error);
        setLoading(false);
      });
  }, []);

  const handleSelect = (assembly) => {
    setSelectedAssembly(assembly.id);
    onSelect(assembly);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filtrage dynamique selon le terme recherché
  const filteredAssemblies = assemblies.filter((assembly) =>
    assembly.itemid.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assembly.id.toString().includes(searchTerm)
  );

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <TableContainer component={Paper} sx={{ marginTop: 2, maxWidth: "100%" }}>
      <Typography variant="h6" sx={{ margin: 2 }}>
        Sélectionnez un Assembly :
      </Typography>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell sx={{ width: "10%", textAlign: "center" }}>Sélection</TableCell>
            <TableCell sx={{ width: "30%", textAlign: "center" }}>Nom</TableCell>
            <TableCell sx={{ width: "10%", textAlign: "center" }}>ID</TableCell>
            <TableCell sx={{ width: "50%", textAlign: "center" }}>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredAssemblies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((assembly) => (
            <TableRow key={assembly.id} sx={{ borderBottom: "1px solid #ddd" }}>
              <TableCell sx={{ textAlign: "center" }}>
                <Radio 
                  checked={selectedAssembly === assembly.id}
                  onChange={() => handleSelect(assembly)}
                  value={assembly.id}
                />
              </TableCell>
              <TableCell sx={{ textAlign: "center" }}>{assembly.itemid}</TableCell>
              <TableCell sx={{ textAlign: "center" }}>{assembly.id}</TableCell>
              <TableCell sx={{ textAlign: "left" }}>{assembly.description || "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 20, 50]}
        component="div"
        count={filteredAssemblies.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}

//BomSelection.jsx
import React, { useEffect, useState } from "react";
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Radio, CircularProgress, Typography, TablePagination
} from "@mui/material";
import axios from "axios";
import { useSearch } from "../context/SearchContext"; // Importation du contexte de recherche

export default function BomSelection({ onSelect }) {
  const { searchTerm } = useSearch(); // Récupérer la valeur de recherche
  const [boms, setBoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBom, setSelectedBom] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    axios.get("http://localhost:5000/api/boms/boms")
      .then(response => {
        setBoms(response.data.items);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des BOMs :", error);
        setLoading(false);
      });
  }, []);

  const handleSelect = (bom) => {
    setSelectedBom(bom.id);
    onSelect(bom);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filtrage dynamique selon le terme recherché
  const filteredBoms = boms.filter((bom) =>
    bom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bom.id.toString().includes(searchTerm)
  );

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <TableContainer component={Paper} sx={{ marginTop: 2, maxWidth: "100%" }}>
      <Typography variant="h6" sx={{ margin: 2 }}>
        Sélectionnez un BOM :
      </Typography>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell sx={{ width: "10%", textAlign: "center" }}>Sélection</TableCell>
            <TableCell sx={{ width: "30%", textAlign: "center" }}>Nom</TableCell>
            <TableCell sx={{ width: "10%", textAlign: "center" }}>ID</TableCell>
            <TableCell sx={{ width: "50%", textAlign: "center" }}>Mémo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredBoms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((bom) => (
            <TableRow key={bom.id} sx={{ borderBottom: "1px solid #ddd" }}>
              <TableCell sx={{ textAlign: "center" }}>
                <Radio 
                  checked={selectedBom === bom.id}
                  onChange={() => handleSelect(bom)}
                  value={bom.id}
                />
              </TableCell>
              <TableCell sx={{ textAlign: "center" }}>{bom.name}</TableCell>
              <TableCell sx={{ textAlign: "center" }}>{bom.id}</TableCell>
              <TableCell sx={{ textAlign: "left" }}>{bom.memo || "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 20, 50]}
        component="div"
        count={filteredBoms.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}

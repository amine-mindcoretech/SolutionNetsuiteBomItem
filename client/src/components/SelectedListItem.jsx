//selectedListItem.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PeopleIcon from '@mui/icons-material/People';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HandymanIcon from '@mui/icons-material/Handyman';
import AttachmentIcon from '@mui/icons-material/Attachment';
import AddLinkIcon from '@mui/icons-material/AddLink';
import DatasetLinkedIcon from '@mui/icons-material/DatasetLinked';

export default function SelectedListItem({ collapsed }) {
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { label: "Creation Utilisateur", icon: <PeopleIcon />, path: '/CreationUsers' },
    { label: 'Outil de Modification', icon: <PeopleIcon />, path: '/afficher-clients/Update' },
    { label: 'Creation BOM et révisions', icon: <HandymanIcon />, path: '/SelcetionCsvSolideWork' },
    { label: "Liaison d'un BOM à un assemblage", icon: <DatasetLinkedIcon />, path: '/LinkingABomAssembly' },
  ];

  return (
    <List style={{ backgroundColor: '#edf2fa', height: '100%' }}>
      {menuItems.map((item, index) => (
        <ListItem key={index} button onClick={() => navigate(item.path)}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          {!collapsed && <ListItemText primary={item.label} />}
        </ListItem>
      ))}
    </List>
  );
}

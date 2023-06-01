import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import {Box, IconButton, Typography} from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import HomeIcon from '@mui/icons-material/Home';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import FolderIcon from '@mui/icons-material/Folder';
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import PageviewIcon from '@mui/icons-material/Pageview';


const Item = ({ title, to, icon, selected, setSelected }) => {
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: 'grey',
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [selected, setSelected] = useState("Dashboard");
  const isCustomer = useSelector((state) => state.auth.isCustomer);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  console.log(isCustomer)
  console.log(isAuthenticated)
  return (
    <Box sx={{ display: "flex", position: "sticky", top: 0, bottom: 0, height:"100%" }}>
    <Box 
      sx={{
        "& .pro-sidebar-inner": {
          background: `white !important`,
          position: "sticky",
          left: 0,
          height: "100%",
          overflow: "auto",
          // width: '100%',

        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",   
        },
        "& .pro-inner-item": {
          padding: "5px 30px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed} width={'230px'} position='static' top='0'>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "0px 0 20px 0",
              color: 'grey',
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h6" color='grey'>
                  KOS SAYA
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          <Box paddingLeft={isCollapsed ? undefined : "2%"} fontSize={'12px'}>
            <Item
              title="Dashboard"
              fontSize='10px'
              to="/"
              icon={<HomeIcon />}
              selected={selected}
              setSelected={setSelected}
            />
           
           {!isCustomer && isAuthenticated && (
            
              <Item
                title="Data Rumah Kos"
                to="/datakos"
                icon={<FolderIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            )}
            {isCustomer && isAuthenticated && (
              <Item
                title="Pencarian Rumah Kos"
                to="/listings"
                icon={<PageviewIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            )}
              {!isAuthenticated && (
              <Item
                title="Pencarian Rumah Kos"
                to="/listings"
                icon={<PageviewIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            )}
            <Item
              title="Profile"
              to="/profileOwner"
              icon={<AccountBoxIcon />}
              selected={selected}
              setSelected={setSelected}
            />

          </Box>
        </Menu>
      </ProSidebar>
    </Box>
    </Box>
  );
};

export default Sidebar;

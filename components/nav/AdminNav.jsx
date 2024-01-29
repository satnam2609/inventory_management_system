"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  Box,
  AppBar,
  Toolbar,
  useTheme,
  Typography,
  IconButton,
  InputBase,
  Button,
  Menu,
  MenuItem,
  Avatar,
  Icon,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { ArrowDropDownOutlined } from "@mui/icons-material";
import FlexBetween from "@/utils/FlexBetween";
import InventoryIcon from "@mui/icons-material/Inventory";

export default function AdminNav() {
  const { data: session } = useSession();

  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      className="appbar"
      sx={{
        position: "static",
        background: "none",
        boxShadow: "none",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* Left side */}
        <FlexBetween>
          <FlexBetween>
            <Typography color={"#005e30"}>
              <InventoryIcon fontSize="large" />
            </Typography>
            <Typography color={"#005e30"} variant="h4">
              IMS
            </Typography>
          </FlexBetween>
          <FlexBetween
            gap="2rem"
            sx={{
              borderRadius: "4px",
              background: "#eeeeee",
              padding: "0.1rem 1.5rem",
              marginLeft: "1rem",
            }}
          >
            <InputBase placeholder="Search here" />
            <IconButton>
              <SearchOutlinedIcon />
            </IconButton>
          </FlexBetween>
        </FlexBetween>

        {/* user profile */}
        <FlexBetween>
          <Button
            onClick={handleClick}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              textTransform: "none",
              gap: "1rem",
            }}
          >
            {/* <Box
                component="img"
                alt="profile"
                src={profileImage}
                height="40px"
                width="40px"
                borderRadius="50%"
                sx={{ objectFit: "cover" }}
              /> */}

            <Avatar sx={{ bgcolor: "#005040" }}>
              {session?.user?.name.at(0)}
            </Avatar>
            <Box textAlign="left">
              <Typography
                fontWeight="bold"
                fontSize="0.85rem"
                sx={{ color: "#121212" }}
              >
                {session?.user && session?.user.name}
              </Typography>

              <Typography fontSize="0.75rem" sx={{ color: "#121212" }}>
                {session?.user && session?.user.email}
              </Typography>
            </Box>
            <ArrowDropDownOutlined
              sx={{ color: "#212121", fontSize: "25px" }}
            />
          </Button>
          <Menu
            hideBackdrop={false}
            anchorEl={anchorEl}
            open={isOpen}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <MenuItem
              sx={{
                backgroundColor: "#fff",
              }}
            >
              <Button
                sx={{
                  color: "#121212",
                }}
                onClick={() => signOut()}
              >
                Log Out
              </Button>
            </MenuItem>
          </Menu>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
}

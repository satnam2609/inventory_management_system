"use client";

import HomeIcon from "@mui/icons-material/Home";
import CategoryIcon from "@mui/icons-material/Category";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ArticleIcon from "@mui/icons-material/Article";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import StoreIcon from "@mui/icons-material/Store";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  Drawer,
  Avatar,
} from "@mui/material";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import FlexBetween from "@/utils/FlexBetween";

export default function AdminDrawer() {
  const pathname = usePathname();

  const [active, setActive] = useState("");
  const router = useRouter();
  useEffect(() => {
    setActive(pathname.substring(7));
  }, [pathname]);

  console.log(active);

  const Items = [
    {
      route: "",
      icon: (
        <HomeIcon
          sx={{
            // color:
            //   pathname === name
            //     ? theme.palette.tertiary["A400"]
            //     : theme.palette.secondary["A100"],
            fontSize: "2rem",
          }}
        />
      ),
      name: "dashboard",
    },
    {
      route: null,
      icon: null,
      name: "inventory",
    },
    {
      route: "categories",
      icon: (
        <CategoryIcon
          sx={{
            // color: theme.palette.secondary["A100"],
            fontSize: "2rem",
          }}
        />
      ),
      name: "categories",
    },
    {
      route: "items",
      icon: (
        <FormatListBulletedIcon
          sx={{
            // color: theme.palette.secondary["A100"],
            fontSize: "2rem",
          }}
        />
      ),
      name: "items",
    },

    {
      route: null,
      icon: null,
      name: "others",
    },
    {
      route: "invoices",
      icon: (
        <ArticleIcon
          sx={{
            // color: theme.palette.secondary["A100"],
            fontSize: "2rem",
          }}
        />
      ),
      name: "invoices",
    },
    // {
    //   route: "record-sales",
    //   icon: (
    //     <InsertDriveFileIcon
    //       sx={{
    //         // color: theme.palette.secondary["A100"],
    //         fontSize: "2rem",
    //       }}
    //     />
    //   ),
    //   name: "sales",
    // },
    {
      route: "analytics",
      icon: (
        <DonutLargeIcon
          sx={{
            // color: theme.palette.secondary["A100"],
            fontSize: "2rem",
          }}
        />
      ),
      name: "analytics",
    },
    {
      route: "purchase-orders",
      icon: (
        <StoreIcon
          sx={{
            // color: theme.palette.secondary["A100"],
            fontSize: "2rem",
          }}
        />
      ),
      name: "purchase order",
    },
  ];

  return (
    <Box component={"nav"}>
      <Drawer
        open={true}
        variant="persistent"
        anchor="left"
        elevation={16}
        hideBackdrop={false}
        sx={{
          width: 250,
          "& .MuiDrawer-paper": {
            color: "#212121", //500
            backgroundColor: "#eeeeee", //700
            boxSixing: "border-box",
            borderWidth: 0,
            width: 240,
          },
        }}
      >
        <Box width="100%">
          <Box m="1.5rem 1rem 1rem 5rem">
            <FlexBetween>
              <Box
                display="flex"
                flexDirection={"column"}
                justifyContent={"center"}
                alignItem="center"
              >
                <Typography variant="h4" fontWeight="bold">
                  Admin
                </Typography>
              </Box>
            </FlexBetween>
          </Box>

          <List
            sx={{
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "column",
            }}
          >
            {Items.map((obj) => {
              if (!obj.icon) {
                return (
                  <Typography key={obj.name} sx={{ m: "2.25rem 0 1rem 3rem" }}>
                    {obj.name}
                  </Typography>
                );
              }

              return (
                <ListItem key={obj.name} disablePadding>
                  <ListItemButton
                    sx={{
                      backgroundColor:
                        active === obj.route
                          ? "#005040" //600
                          : "transparent",
                      color: active === obj.route ? "#fff" : "black",
                    }}
                    onClick={() => router.push(`/admin/${obj.route}`)}
                  >
                    <ListItemIcon
                      sx={{
                        color:
                          active === obj.route
                            ? "#fff" //600
                            : "#121212",
                      }}
                    >
                      {obj.icon}
                    </ListItemIcon>
                    <ListItemText>{obj.name}</ListItemText>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}

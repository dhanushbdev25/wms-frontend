import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// material-ui
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Divider,
  Paper,
  Popper,
  Stack,
  Typography,
} from "@mui/material";

// project import
import Transitions from "../../../../../components/@extended/Transitions";
import SettingTab from "./SettingTab";
import { useAppDispatch, useAppSelector } from "../../../../../store/store";

// assets
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { logoutApp } from "../../../../../store/reducers/actions";

// ==============================|| HEADER CONTENT - PROFILE (Modern SAP Fiori) ||============================== //

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state: any) => state.user.userInfo.userInfo);
  const userRole = useAppSelector(
    (state: any) => state.user.userInfo.userRole[0].ROLE
  );
  const handleLogout = async () => {
    dispatch(logoutApp());
    navigate("/");
  };

  const anchorRef = useRef<any>(null);
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: any) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  // Get user initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 1 }}>
      <ButtonBase
        sx={{
          p: 1,
          borderRadius: "4px",
          bgcolor: open ? "#FFF3E0" : "transparent",
          "&:hover": { 
            bgcolor: "#F5F6FA",
          },
          transition: "background-color 0.2s ease",
        }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? "profile-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: "#F57C00",
              color: "#FFFFFF",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            {getInitials(userInfo?.USERNAME || "User")}
          </Avatar>
          <Stack direction="column" spacing={0} alignItems="flex-start">
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#32363A",
                lineHeight: 1.2,
              }}
            >
              {userInfo?.USERNAME}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                fontSize: "0.75rem",
                color: "#6A6D70",
                lineHeight: 1.2,
              }}
            >
              {userRole?.ROLEDESC}
            </Typography>
          </Stack>
        </Stack>
      </ButtonBase>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 8],
              },
            },
          ],
        }}
        onClickAway={handleClose}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            {open && (
              <Paper
                sx={{
                  width: 320,
                  borderRadius: "8px",
                  boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12), 0px 2px 8px rgba(0, 0, 0, 0.08)",
                  border: "1px solid #D9D9D9",
                  overflow: "hidden",
                }}
              >
                {/* User Info Section */}
                <Box sx={{ p: 3, backgroundColor: "#F5F6FA" }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: "#F57C00",
                        color: "#FFFFFF",
                        fontSize: "1rem",
                        fontWeight: 600,
                      }}
                    >
                      {getInitials(userInfo?.USERNAME || "User")}
                    </Avatar>
                    <Stack direction="column" spacing={0.5} flex={1}>
                      <Typography 
                        variant="subtitle1"
                        sx={{ 
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: "#32363A",
                        }}
                      >
                        {userInfo?.USERNAME}
                      </Typography>
                      <Typography 
                        variant="body2"
                        sx={{ 
                          fontSize: "0.75rem",
                          color: "#6A6D70",
                        }}
                      >
                        {userRole?.ROLEDESC}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>

                <Divider />

                {/* Settings Section */}
                <Box sx={{ p: 2 }}>
                  <SettingTab />
                </Box>

                <Divider />

                {/* Logout Button Section */}
                <Box sx={{ p: 2 }}>
                  <Button
                    fullWidth
                    variant="text"
                    startIcon={<LogoutOutlined />}
                    onClick={handleLogout}
                    sx={{
                      color: "#6A6D70",
                      textTransform: "none",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      py: 1.25,
                      px: 2,
                      borderRadius: "4px",
                      justifyContent: "flex-start",
                      "&:hover": {
                        backgroundColor: "#F5F6FA",
                        color: "#32363A",
                      },
                    }}
                  >
                    Logout
                  </Button>
                </Box>
              </Paper>
            )}
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Profile;

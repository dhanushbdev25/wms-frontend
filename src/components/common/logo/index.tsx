import React from "react";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";

// material-ui
import { ButtonBase } from "@mui/material";

// project import
import Logo from "./Logo";
import { activeItem } from "../../../store/reducers/menu";
import { useAppDispatch, useAppSelector } from "../../../store/store";

// ==============================|| MAIN LOGO ||============================== //

interface LogoSectionProps {
  sx?: React.CSSProperties;
  to?: string;
}

const LogoSection: React.FC<LogoSectionProps> = ({ sx, to }) => {
  const { defaultId } = useAppSelector(
    (state: { menu: { defaultId: string } }) => state.menu
  );
  const dispatch = useAppDispatch();
  const defaultRoute = useAppSelector((state: any) => state.user.defaultRoute);
  return (
    <ButtonBase
      disableRipple
      component={RouterLink}
      onClick={() => dispatch(activeItem({ openItem: [defaultId] }))}
      to={!to ? defaultRoute : to}
      sx={sx}
    >
      <Logo />
    </ButtonBase>
  );
};

LogoSection.propTypes = {
  sx: PropTypes.object,
  to: PropTypes.string,
};

export default LogoSection;

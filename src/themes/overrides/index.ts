// third-party
import { Theme } from "@mui/material";
import { merge } from "lodash";

// project import
import Badge from "./Badge";
import Button from "./Button";
import CardContent from "./CardContent";
import Checkbox from "./Checkbox";
import Chip from "./Chip";
import DataGrid from "./DataGrid";
import IconButton from "./IconButton";
import Input from "./Input";
import LinearProgress from "./LinearProgress";
import Link from "./Link";
import ListItemIcon from "./ListItemIcon";
import Paper from "./Paper";
import ScrollBar from "./ScrollBar";
import Tab from "./Tab";
import TableCell from "./TableCell";
import Tabs from "./Tabs";
import Typography from "./Typography";

// ==============================|| OVERRIDES - MAIN ||============================== //

export default function ComponentsOverrides(theme: Theme) {
  return merge(
    Button(theme),
    Paper(),
    Badge(theme),
    CardContent(),
    Checkbox(theme),
    Chip(theme),
    IconButton(theme),
    Input(theme),
    LinearProgress(),
    Link(),
    DataGrid(),
    ListItemIcon(),
    Tab(theme),
    TableCell(theme),
    Tabs(),
    Typography(),
    ScrollBar(),
  );
}

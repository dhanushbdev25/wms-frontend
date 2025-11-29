import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  List,
  ListItem,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import DropDown from "../../../../../components/common/dropDown/DropDown";
import { useAppSelector } from "../../../../../store/store";
import {
  setSelectedRoleID,
  setSelectWareHouse,
} from "../../../../../store/reducers/userInfo";
import { useGetWareHouseListQuery } from "../../../../../store/api/configuration/configurationAPI";
import { useNavigate } from "react-router-dom";

const SettingTab = () => {
  const theme = useTheme();
  const { data: warehousesID, isLoading: wareHouseLoading } =
    useGetWareHouseListQuery(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const Roles = useAppSelector((state: any) => state.user.userInfo.userRole);
  const wareHouse = useAppSelector((state:any) => state.user.defaultOU);
  const selectWareHouse = useSelector((State:any)=>State.user.selectWareHouse);

  const defaultRole = useAppSelector(
    (state: any) => state.user.userInfo.defaultRole,
  );
  const selectedRoleID = useAppSelector(
    (state: any) => state.user.selectedRole,
  );

  const [selectedRole, setSelectedRole] = useState(
    selectedRoleID || defaultRole.ROLEID,
  );
  const [selectedOUID, setSelectedOUID] = useState(selectWareHouse);

  const roleOptions = Roles.map((role: any) => ({
    label: role.ROLE.ROLEDESC,
    value: role.ROLEID,
  }));

  const warehouseOptions = warehousesID?.data?.map((role: any) => ({
    label: role.WAREHOUSE_CODE,
    value: role.WAREHOUSE_ID,
  }));
  

  const handleWareHouseChange = (event: any) => {
    const newWareHouseId = event.target.value; 
    setSelectedOUID(newWareHouseId);
    dispatch(setSelectWareHouse(newWareHouseId));
    navigate('/WMS/inbound', { replace: true });
  };

  const handleRoleChange = async (event: any) => {
    event.stopPropagation();
    const newRole = event.target.value;
    setSelectedRole(newRole);
    await dispatch(setSelectedRoleID(newRole));
    window.location.reload();
  };

  return (
    <List
      component="nav"
      sx={{
        p: 0,
        "& .MuiListItemIcon-root": {
          minWidth: 32,
          color: theme.palette.grey[500],
        },
      }}
    >
      <ListItem id="role-dropdown">
        <DropDown
          fullWidth
          list={roleOptions}
          onChange={(e: any) => handleRoleChange(e)}
          value={selectedRole}
          label="Change Role"
        />
      </ListItem>

      <ListItem id="WareHouse-dropdown">
        <DropDown
          fullWidth
          list={warehouseOptions}
          onChange={(e: any) => handleWareHouseChange(e)}
          value={selectedOUID}
          label="Change WareHouse"
        />
      </ListItem>

      {/* <ListItemButton
        selected={selectedIndex === 0}
        onClick={() => handleListItemClick(0)}
      >
        <ListItemIcon>
          <QuestionCircleOutlined />
        </ListItemIcon>
        <ListItemText primary="Support" />
      </ListItemButton>
      <ListItemButton
        selected={selectedIndex === 1}
        onClick={() => handleListItemClick(1)}
      >
        <ListItemIcon>
          <UserOutlined />
        </ListItemIcon>
        <ListItemText primary="Account Settings" />
      </ListItemButton>
      <ListItemButton
        selected={selectedIndex === 2}
        onClick={() => handleListItemClick(2)}
      >
        <ListItemIcon>
          <LockOutlined />
        </ListItemIcon>
        <ListItemText primary="Privacy Center" />
      </ListItemButton>
      <ListItemButton
        selected={selectedIndex === 3}
        onClick={() => handleListItemClick(3)}
      >
        <ListItemIcon>
          <CommentOutlined />
        </ListItemIcon>
        <ListItemText primary="Feedback" />
      </ListItemButton>
      <ListItemButton
        selected={selectedIndex === 4}
        onClick={() => handleListItemClick(4)}
      >
        <ListItemIcon>
          <UnorderedListOutlined />
        </ListItemIcon>
        <ListItemText primary="History" />
      </ListItemButton> */}
    </List>
  );
};

export default SettingTab;

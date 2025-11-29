import { createSlice, Slice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: {
    userOuMapping: null,
    userRole: null,
    defaultRole: null,
    defaultRoleModules: null,
    token: null,
    userInfo: null,
  },
  selectedRole: null,
  defaultRoute: null,
  defaultOU: null,
  selectWareHouse :null,
};

const userSlice: Slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      state.userInfo = action.payload;
      state.defaultOU = action.payload.defaultOu.OUID;
    },
    setDefaultRoute: (state, action) => {
      state.defaultRoute = action.payload;
    },
    setDefaultOu: (state, action) => {
      state.defaultOU = action.payload;
    },
    setSelectedRoleID: (state, action) => {
      state.selectedRole = action.payload;
    },
    setSelectWareHouse: (state, action) => {
      state.selectWareHouse = action.payload;
    },
  },
});

export const {
  setUserDetails,
  setDefaultRoute,
  setDefaultOu,
  setSelectedRoleID,
  setSelectWareHouse,
} = userSlice.actions;

export default userSlice.reducer;

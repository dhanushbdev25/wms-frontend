import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  routeMapping: null,
};

const routeMappingSlice = createSlice({
  name: "routeMapping",
  initialState,
  reducers: {
    setRouteMapping: (state, action) => {
      state.routeMapping = action.payload;
    },
  },
});

export const { setRouteMapping } = routeMappingSlice.actions;

export default routeMappingSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StorageState {
  isUpdating: boolean;
  updateSkuId: number;
}

const initialState: StorageState = {
  isUpdating: false,
  updateSkuId: 0,
};

const storageAddSlice = createSlice({
  name: "storage",
  initialState,
  reducers: {
    setUpdate: (state, action: PayloadAction<boolean>) => {
      state.isUpdating = action.payload;
    },
    setSkuId: (state, action: PayloadAction<number>) => {
      state.updateSkuId = action.payload;
    },
  },
});

export const { setUpdate, setSkuId } = storageAddSlice.actions;
export default storageAddSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  data: any | null;
  accessToken: string | null;
}

const initialState: UserState = {
  data: null,
  accessToken: null,//TODO:
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    clearUser: (state) => {
      state.data = null;
      state.accessToken = null;
    },
  },
});

export const { setUser, setAccessToken, clearUser } = userSlice.actions;
export default userSlice.reducer;

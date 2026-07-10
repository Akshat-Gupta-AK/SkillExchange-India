import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api.js";

export const fetchMatches = createAsyncThunk("matches/fetch", async () => {
  const res = await api.get("/matches");
  return res.data;
});

export const sendMatchRequest = createAsyncThunk("matches/send", async (data, { rejectWithValue }) => {
  try {
    const res = await api.post("/matches", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateMatchStatus = createAsyncThunk("matches/update", async ({ id, status }) => {
  const res = await api.patch(`/matches/${id}`, { status });
  return res.data;
});

const matchSlice = createSlice({
  name: "matches",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatches.pending, (state) => { state.loading = true; })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(sendMatchRequest.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updateMatchStatus.fulfilled, (state, action) => {
        const idx = state.list.findIndex((m) => m._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      });
  },
});

export default matchSlice.reducer;

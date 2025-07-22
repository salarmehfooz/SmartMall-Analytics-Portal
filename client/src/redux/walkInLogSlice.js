import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:3000/api";

// Fetch walk-in logs (route depends on user role)
export const fetchWalkInLogs = createAsyncThunk(
  "walkInLogs/fetchWalkInLogs",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const role = getState().auth.user.role;

      // StoreManager fetches their own logs (/walkinlogs/my)
      // Admin fetches all logs (/walkinlogs)
      const url =
        role === "storeManager"
          ? `${API_URL}/walkinlogs/my`
          : `${API_URL}/walkinlogs`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to fetch walk-in logs");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch walk-in logs");
    }
  }
);

// Add walk-in log (store manager)
export const addWalkInLog = createAsyncThunk(
  "walkInLogs/addWalkInLog",
  async (walkInData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await fetch(`${API_URL}/walkinlogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(walkInData),
      });
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to add walk-in log");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to add walk-in log");
    }
  }
);

const walkInLogSlice = createSlice({
  name: "walkInLogs",
  initialState: {
    logs: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWalkInLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWalkInLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload;
      })
      .addCase(fetchWalkInLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addWalkInLog.pending, (state) => {
        state.error = null;
      })
      .addCase(addWalkInLog.fulfilled, (state, action) => {
        state.logs.push(action.payload.log); // payload has message + log
      })
      .addCase(addWalkInLog.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default walkInLogSlice.reducer;

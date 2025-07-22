import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  trends: [],
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
};

// Fetch all telco trends (admin)
export const fetchTelcoTrends = createAsyncThunk(
  "telcoTrends/fetchTelcoTrends",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.token;

      const response = await fetch("http://localhost:3000/api/telcotrends", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch telco trends");
      }

      const data = await response.json();
      return data; // trends array
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Create a new telco trend (admin)
export const createTelcoTrend = createAsyncThunk(
  "telcoTrends/createTelcoTrend",
  async (newTrend, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.token;

      const response = await fetch("http://localhost:3000/api/telcotrends", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTrend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create telco trend");
      }

      const { trend } = await response.json(); // match controller
      return trend;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Fetch telco trends filtered by store category (storeManager)
export const fetchMyCategoryTrends = createAsyncThunk(
  "telcoTrends/fetchMyCategoryTrends",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.token;

      const response = await fetch(
        "http://localhost:3000/api/telcotrends/my-category",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to fetch my category trends"
        );
      }

      const data = await response.json();
      return data; // ✅ this is the trends array already
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const telcoTrendSlice = createSlice({
  name: "telcoTrends",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all trends
      .addCase(fetchTelcoTrends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTelcoTrends.fulfilled, (state, action) => {
        state.loading = false;
        state.trends = action.payload;
      })
      .addCase(fetchTelcoTrends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create new trend
      .addCase(createTelcoTrend.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createTelcoTrend.fulfilled, (state, action) => {
        state.createLoading = false;
        state.trends.unshift(action.payload);
      })
      .addCase(createTelcoTrend.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
      })

      // Fetch category-specific trends
      .addCase(fetchMyCategoryTrends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyCategoryTrends.fulfilled, (state, action) => {
        state.loading = false;
        state.trends = action.payload;
      })
      .addCase(fetchMyCategoryTrends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default telcoTrendSlice.reducer;

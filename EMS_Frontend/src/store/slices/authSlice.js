import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getCompanies, loginUser, registerUser } from '../../api/authApi';

const FALLBACK_COMPANIES = [
  { id: 'COMP_A', name: 'Company A' },
  { id: 'COMP_B', name: 'Company B' },
  { id: 'COMP_C', name: 'Company C' },
  { id: 'COMP_D', name: 'Company D' }
];

function loadStoredUser() {
  try {
    const raw = localStorage.getItem('ems_user');
    const token = localStorage.getItem('ems_token');
    if (!raw || !token) {
      return { user: null, token: null };
    }
    return { user: JSON.parse(raw), token };
  } catch (error) {
    return { user: null, token: null };
  }
}

const stored = loadStoredUser();

export const fetchCompanies = createAsyncThunk('auth/fetchCompanies', async () => {
  try {
    const response = await getCompanies();
    return response.data && response.data.length > 0 ? response.data : FALLBACK_COMPANIES;
  } catch (error) {
    return FALLBACK_COMPANIES;
  }
});

export const loginUserThunk = createAsyncThunk(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await loginUser(payload);
      localStorage.setItem('ems_token', response.token);
      localStorage.setItem('ems_user', JSON.stringify(response.user));
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed. Please try again.');
    }
  }
);

export const registerUserThunk = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await registerUser(payload);
      localStorage.setItem('ems_token', response.token);
      localStorage.setItem('ems_user', JSON.stringify(response.user));
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: stored.user,
    token: stored.token,
    companies: FALLBACK_COMPANIES,
    loading: false,
    error: ''
  },
  reducers: {
    logout(state) {
      localStorage.removeItem('ems_token');
      localStorage.removeItem('ems_user');
      state.user = null;
      state.token = null;
      state.error = '';
    },
    setAuthError(state, action) {
      state.error = action.payload;
    },
    clearAuthError(state) {
      state.error = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.companies = action.payload;
      })
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, setAuthError, clearAuthError } = authSlice.actions;
export default authSlice.reducer;


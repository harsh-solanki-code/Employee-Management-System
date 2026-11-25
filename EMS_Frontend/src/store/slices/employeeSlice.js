import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee
} from '../../api/employeeApi';

const initialFilters = {
  search: '',
  department: '',
  status: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  limit: 10
};

export const fetchEmployees = createAsyncThunk(
  'employees/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await getEmployees(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load employees');
    }
  }
);

export const addEmployee = createAsyncThunk(
  'employees/add',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await createEmployee(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add employee');
    }
  }
);

export const editEmployee = createAsyncThunk(
  'employees/edit',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await updateEmployee(id, payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update employee');
    }
  }
);

export const removeEmployee = createAsyncThunk(
  'employees/remove',
  async (id, { rejectWithValue }) => {
    try {
      await deleteEmployee(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete employee');
    }
  }
);

const employeeSlice = createSlice({
  name: 'employees',
  initialState: {
    list: [],
    pagination: {
      total: 0,
      totalPages: 1
    },
    filters: initialFilters,
    loading: false,
    submitting: false,
    deleting: false,
    error: '',
    formError: '',
    successMessage: ''
  },
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters(state) {
      state.filters = initialFilters;
    },
    clearMessages(state) {
      state.error = '';
      state.successMessage = '';
    },
    clearFormError(state) {
      state.formError = '';
    },
    resetEmployeeState(state) {
      state.list = [];
      state.pagination = { total: 0, totalPages: 1 };
      state.filters = initialFilters;
      state.error = '';
      state.formError = '';
      state.successMessage = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data || [];
        state.pagination = {
          total: action.payload.pagination?.total || 0,
          totalPages: action.payload.pagination?.totalPages || 1
        };
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addEmployee.pending, (state) => {
        state.submitting = true;
        state.formError = '';
      })
      .addCase(addEmployee.fulfilled, (state) => {
        state.submitting = false;
        state.successMessage = 'Employee added successfully';
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.submitting = false;
        state.formError = action.payload;
      })
      .addCase(editEmployee.pending, (state) => {
        state.submitting = true;
        state.formError = '';
      })
      .addCase(editEmployee.fulfilled, (state) => {
        state.submitting = false;
        state.successMessage = 'Employee updated successfully';
      })
      .addCase(editEmployee.rejected, (state, action) => {
        state.submitting = false;
        state.formError = action.payload;
      })
      .addCase(removeEmployee.pending, (state) => {
        state.deleting = true;
        state.error = '';
      })
      .addCase(removeEmployee.fulfilled, (state) => {
        state.deleting = false;
        state.successMessage = 'Employee deleted successfully';
      })
      .addCase(removeEmployee.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  }
});

export const {
  setFilters,
  resetFilters,
  clearMessages,
  clearFormError,
  resetEmployeeState
} = employeeSlice.actions;

export default employeeSlice.reducer;


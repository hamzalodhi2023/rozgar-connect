import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createJob, getJobs, updateJobStatus as apiUpdateJobStatus } from '../../services/job.service.js';

interface JobState {
  jobs: any[];
  loading: boolean;
  error: string | null;
}

const initialState: JobState = {
  jobs: [],
  loading: false,
  error: null,
};

export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async (_, { rejectWithValue }) => {
  try {
    const response = await getJobs();
    return response.data.jobs;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch jobs');
  }
});

export const createJobRequest = createAsyncThunk('jobs/createJob', async (jobData: { workerId: string, description: string }, { rejectWithValue }) => {
  try {
    const response = await createJob(jobData);
    return response.data.job;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create job');
  }
});

export const updateJobStatus = createAsyncThunk('jobs/updateJobStatus', async ({ jobId, status }: { jobId: string, status: string }, { rejectWithValue }) => {
  try {
    const response = await apiUpdateJobStatus(jobId, status);
    return response.data.job;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update job status');
  }
});

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearJobError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createJobRequest.fulfilled, (state, action) => {
        state.jobs.unshift(action.payload);
      })
      .addCase(updateJobStatus.fulfilled, (state, action) => {
        const index = state.jobs.findIndex(j => j._id === action.payload._id);
        if (index !== -1) {
          state.jobs[index].status = action.payload.status;
        }
      });
  },
});

export const { clearJobError } = jobSlice.actions;
export default jobSlice.reducer;

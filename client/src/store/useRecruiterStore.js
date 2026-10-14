import { create } from 'zustand';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useRecruiterStore = create((set, get) => ({
  pipeline: [],
  loading: false,

  fetchPipeline: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/applications');
      set({ pipeline: res.data.data.pipeline });
    } catch (err) {
      toast.error('Failed to load pipeline');
    } finally {
      set({ loading: false });
    }
  },

  addToPipeline: async (developerId) => {
    try {
      const res = await api.post('/applications', { developerId });
      set(state => ({ pipeline: [res.data.data.application, ...state.pipeline] }));
      toast.success('Added to pipeline!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add');
    }
  },

  updateStatus: async (id, status) => {
    // Optimistic update
    const previousPipeline = [...get().pipeline];
    set(state => ({
      pipeline: state.pipeline.map(app => 
        app._id === id ? { ...app, status } : app
      )
    }));

    try {
      await api.put(`/applications/${id}`, { status });
      toast.success(`Moved to ${status}`);
    } catch (err) {
      // Revert on error
      set({ pipeline: previousPipeline });
      toast.error('Failed to update status');
    }
  },

  removeFromPipeline: async (id) => {
    const previousPipeline = [...get().pipeline];
    set(state => ({ pipeline: state.pipeline.filter(app => app._id !== id) }));
    
    try {
      await api.delete(`/applications/${id}`);
      toast.success('Removed from pipeline');
    } catch (err) {
      set({ pipeline: previousPipeline });
      toast.error('Failed to remove');
    }
  }
}));

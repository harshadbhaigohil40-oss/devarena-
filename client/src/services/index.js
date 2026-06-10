import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const challengeService = {
  list: (params) => api.get('/challenges', { params }),
  get: (slug) => api.get(`/challenges/${slug}`),
  submit: (id, data) => api.post(`/challenges/${id}/submit`, data),
  getSubmissions: (id) => api.get(`/challenges/${id}/submissions`),
};

export const projectService = {
  list: (params) => api.get('/projects', { params }),
  get: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  like: (id) => api.post(`/projects/${id}/like`),
};

export const userService = {
  getProfile: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
  getStats: (id) => api.get(`/users/${id}/stats`),
  getBadges: (id) => api.get(`/users/${id}/badges`),
  getXPHistory: (id, params) => api.get(`/users/${id}/xp-history`, { params }),
};

export const leaderboardService = {
  get: (params) => api.get('/leaderboard', { params }),
  getRank: (userId) => api.get(`/leaderboard/rank/${userId}`),
};

export const skillTreeService = {
  list: () => api.get('/skill-trees'),
  get: (id) => api.get(`/skill-trees/${id}`),
};

export const badgeService = {
  list: () => api.get('/badges'),
  getUserBadges: (userId) => api.get(`/badges/user/${userId}`),
};

export const aiService = {
  getCareerAdvice: (question) => api.post('/ai/career-advice', { question }),
  getSkillRecommendation: () => api.post('/ai/skill-recommendation'),
  getCodeReview: (code, language) => api.post('/ai/code-review', { code, language }),
  analyzeResume: (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    return api.post('/ai/analyze-resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  generateRoadmap: (data) => api.post('/ai/generate-roadmap', data),
};

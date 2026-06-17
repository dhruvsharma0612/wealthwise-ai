import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401 try refresh once, then redirect to login
api.interceptors.response.use(
  (r) => r,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
            { refreshToken }
          );
          localStorage.setItem("accessToken",  data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          original.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(original);
        } catch {
          localStorage.clear();
          window.location.href = "/login";
        }
      } else {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;

// ─── Typed API calls ──────────────────────────────────────────────────────────

export const authApi = {
  signup: (body: { email: string; password: string; firstName: string; lastName: string; currency: string }) =>
    api.post("/api/auth/signup", body),
  login: (body: { email: string; password: string }) =>
    api.post("/api/auth/login", body),
  logout: (refreshToken: string) =>
    api.post("/api/auth/logout", { refreshToken }),
};

export const profileApi = {
  get:         ()     => api.get("/api/profile"),
  healthScore: ()     => api.get("/api/profile/health-score"),
};

export const goalsApi = {
  list:       ()                         => api.get("/api/goals"),
  get:        (id: string)               => api.get(`/api/goals/${id}`),
  create:     (body: object)             => api.post("/api/goals", body),
  update:     (id: string, body: object) => api.patch(`/api/goals/${id}`, body),
  contribute: (id: string, amount: number) => api.post(`/api/goals/${id}/contribute`, { amount }),
  remove:     (id: string)               => api.delete(`/api/goals/${id}`),
};

export const portfolioApi = {
  get:         ()                         => api.get("/api/portfolio"),
  allocation:  ()                         => api.get("/api/portfolio/allocation"),
  addAsset:    (body: object)             => api.post("/api/portfolio/assets", body),
  updateAsset: (id: string, body: object) => api.patch(`/api/portfolio/assets/${id}`, body),
  removeAsset: (id: string)               => api.delete(`/api/portfolio/assets/${id}`),
};

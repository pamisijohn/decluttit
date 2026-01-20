import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("decluttit_token")
        : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("decluttit_token");
        localStorage.removeItem("decluttit_user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth APIs
export const authAPI = {
  register: (data: {
    email: string;
    phone?: string;
    password: string;
    fullName: string;
  }) => api.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
  updateProfile: (data: any) => api.put("/auth/profile", data),
};

// Listings APIs
export const listingsAPI = {
  getAll: (params?: any) => api.get("/listings", { params }),
  getById: (id: string) => api.get(`/listings/${id}`),
  create: (data: any) => api.post("/listings", data),
  update: (id: string, data: any) => api.put(`/listings/${id}`, data),
  delete: (id: string) => api.delete(`/listings/${id}`),
  getMyListings: () => api.get("/listings/user"),
};

// Requests APIs
export const requestsAPI = {
  getAll: (params?: any) => api.get("/requests", { params }),
  getById: (id: string) => api.get(`/requests/${id}`),
  create: (data: any) => api.post("/requests", data),
  update: (id: string, data: any) => api.put(`/requests/${id}`, data),
  delete: (id: string) => api.delete(`/requests/${id}`),
  getMyRequests: () => api.get("/requests/my"),
};

// Matching APIs
export const matchingAPI = {
  getMatchesForRequest: (requestId: string) =>
    api.get(`/matches/requests/${requestId}`),
  getMatchesForListing: (listingId: string) =>
    api.get(`/matches/listings/${listingId}`),
  initiateTransaction: (data: { listingId: string; requestId?: string }) =>
    api.post("/matches/initiate", data),
};

// Transactions APIs
export const transactionsAPI = {
  getAll: (params?: any) => api.get("/transactions", { params }),
  getById: (id: string) => api.get(`/transactions/${id}`),
  markAsShipped: (id: string) => api.post(`/transactions/${id}/ship`),
  confirmReceipt: (id: string) => api.post(`/transactions/${id}/confirm`),
  releaseFunds: (id: string) => api.post(`/transactions/${id}/release`),
};

// Payments APIs
export const paymentsAPI = {
  initialize: (transactionId: string) =>
    api.post("/payments/initialize", { transactionId }),
  verify: (reference: string) =>
    api.get("/payments/verify", { params: { reference } }),
  getHistory: () => api.get("/payments/history"),
};

// Chat APIs
export const chatAPI = {
  getConversations: () => api.get("/chat"),
  getConversation: (id: string) => api.get(`/chat/${id}`),
  sendMessage: (
    conversationId: string,
    data: { content: string; messageType?: string }
  ) => api.post(`/chat/${conversationId}/messages`, data),
  startConversation: (transactionId: string) =>
    api.post("/chat/start", { transactionId }),
  markAsRead: (id: string) => api.put(`/chat/${id}/read`),
};

// Disputes APIs
export const disputesAPI = {
  getMyDisputes: () => api.get("/disputes"),
  getById: (id: string) => api.get(`/disputes/${id}`),
  create: (transactionId: string, data: any) =>
    api.post(`/disputes/${transactionId}`, data),
  addEvidence: (id: string, evidence: string) =>
    api.post(`/disputes/${id}/evidence`, { evidence }),
};

import { api } from './client';
import type { Note, NotesResponse } from './types';

export const notesApi = {
  list: (page = 1, limit = 20) =>
    api.get<NotesResponse>(`/notes?page=${page}&limit=${limit}`),

  get: (id: string) => api.get<Note>(`/notes/${id}`),

  create: (data: Partial<Note>) => api.post<Note>('/notes', data),

  update: (id: string, data: Partial<Note>) =>
    api.put<Note>(`/notes/${id}`, data),

  delete: (id: string) => api.delete<void>(`/notes/${id}`),

  search: (query: string) =>
    api.get<NotesResponse>(`/notes/search?q=${encodeURIComponent(query)}`),
};

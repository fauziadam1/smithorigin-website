'use client'

export const saveAuth = (token: string) => {
  localStorage.setItem('accessToken', token);
};

export const getAuth = (): { token: string | null } => {
  if (typeof window === 'undefined') return { token: null };
  const token = localStorage.getItem('accessToken');
  return { token };
};

export const clearAuth = () => {
  localStorage.removeItem('accessToken');
};

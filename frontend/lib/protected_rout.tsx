'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth } from './auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    const { token, user } = getAuth();
    
    if (!token || !user) {
      router.push('/sign-in');
      return;
    }

    if (adminOnly && !user.isAdmin) {
      router.push('/user/dashboard');
      return;
    }
  }, [router, adminOnly]);

  return <>{children}</>;
}
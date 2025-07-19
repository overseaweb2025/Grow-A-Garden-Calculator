'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  isAuthenticated, 
  getAuthState, 
  logout, 
  refreshAuth, 
  getRemainingTime,
  type AuthState 
} from '@/lib/auth';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    username: null,
    loginTime: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 检查认证状态
  const checkAuth = () => {
    const state = getAuthState();
    setAuthState(state);
    return state.isAuthenticated;
  };

  // 登出函数
  const handleLogout = () => {
    logout();
    setAuthState({
      isAuthenticated: false,
      username: null,
      loginTime: null
    });
    router.push('/admin');
  };

  // 刷新认证状态
  const handleRefreshAuth = () => {
    const success = refreshAuth();
    if (success) {
      checkAuth();
    }
    return success;
  };

  // 获取剩余时间（格式化）
  const getRemainingTimeFormatted = () => {
    const remaining = getRemainingTime();
    if (remaining <= 0) return '已过期';
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}小时${minutes}分钟`;
  };

  // 初始化和监听存储变化
  useEffect(() => {
    // 初始检查
    checkAuth();
    setIsLoading(false);

    // 监听存储变化（多标签页同步）
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'garden_auth_token' || e.key === 'garden_auth_expiry') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // 定期检查认证状态（防止过期）
    const interval = setInterval(() => {
      if (!checkAuth()) {
        // 如果认证失效，清除状态
        setAuthState({
          isAuthenticated: false,
          username: null,
          loginTime: null
        });
      }
    }, 60000); // 每分钟检查一次

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return {
    ...authState,
    isLoading,
    checkAuth,
    logout: handleLogout,
    refreshAuth: handleRefreshAuth,
    getRemainingTimeFormatted
  };
}

// 保护路由的Hook
export function useProtectedRoute(redirectTo: string = '/admin') {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return { isAuthenticated, isLoading };
}

// 仅检查登录状态的轻量Hook（用于导航组件）
export function useAuthStatus() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 检查登录状态
    const checkAuthStatus = () => {
      try {
        const authData = localStorage.getItem('garden_auth_token');
        const expiryTime = localStorage.getItem('garden_auth_expiry');

        if (!authData || !expiryTime) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        const now = Date.now();
        const expiry = parseInt(expiryTime);
        
        if (now > expiry) {
          // 已过期
          setIsAuthenticated(false);
        } else {
          // 未过期
          const parsed = JSON.parse(authData);
          setIsAuthenticated(parsed.isAuthenticated === true);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };

    // 在客户端检查状态
    checkAuthStatus();

    // 监听存储变化（多标签页同步）
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'garden_auth_token' || e.key === 'garden_auth_expiry') {
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return { isAuthenticated, isLoading };
} 
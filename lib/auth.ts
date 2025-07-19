// 权限管理系统
const AUTH_STORAGE_KEY = 'garden_auth_token';
const AUTH_EXPIRY_KEY = 'garden_auth_expiry';

// 预设的管理员账户
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: '147258369'
};

// 登录状态接口
export interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  loginTime: number | null;
}

// 验证账户信息
export function validateCredentials(username: string, password: string): boolean {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
}

// 执行登录
export function login(username: string, password: string): boolean {
  if (!validateCredentials(username, password)) {
    return false;
  }

  const loginTime = Date.now();
  const expiryTime = loginTime + (24 * 60 * 60 * 1000); // 24小时后过期

  // 存储到本地存储
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
    username,
    loginTime,
    isAuthenticated: true
  }));
  localStorage.setItem(AUTH_EXPIRY_KEY, expiryTime.toString());

  return true;
}

// 执行登出
export function logout(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(AUTH_EXPIRY_KEY);
}

// 检查是否已登录
export function isAuthenticated(): boolean {
  try {
    const authData = localStorage.getItem(AUTH_STORAGE_KEY);
    const expiryTime = localStorage.getItem(AUTH_EXPIRY_KEY);

    if (!authData || !expiryTime) {
      return false;
    }

    // 检查是否过期
    const now = Date.now();
    const expiry = parseInt(expiryTime);
    
    if (now > expiry) {
      // 已过期，清除数据
      logout();
      return false;
    }

    const parsed = JSON.parse(authData);
    return parsed.isAuthenticated === true;
  } catch (error) {
    // 解析错误，清除数据
    logout();
    return false;
  }
}

// 获取当前认证状态
export function getAuthState(): AuthState {
  try {
    const authData = localStorage.getItem(AUTH_STORAGE_KEY);
    
    if (!authData || !isAuthenticated()) {
      return {
        isAuthenticated: false,
        username: null,
        loginTime: null
      };
    }

    const parsed = JSON.parse(authData);
    return {
      isAuthenticated: true,
      username: parsed.username,
      loginTime: parsed.loginTime
    };
  } catch (error) {
    return {
      isAuthenticated: false,
      username: null,
      loginTime: null
    };
  }
}

// 获取剩余有效时间（毫秒）
export function getRemainingTime(): number {
  try {
    const expiryTime = localStorage.getItem(AUTH_EXPIRY_KEY);
    
    if (!expiryTime) {
      return 0;
    }

    const expiry = parseInt(expiryTime);
    const now = Date.now();
    
    return Math.max(0, expiry - now);
  } catch (error) {
    return 0;
  }
}

// 刷新登录状态（延长有效期）
export function refreshAuth(): boolean {
  if (!isAuthenticated()) {
    return false;
  }

  const authState = getAuthState();
  if (!authState.isAuthenticated || !authState.username) {
    return false;
  }

  // 延长24小时
  const newExpiryTime = Date.now() + (24 * 60 * 60 * 1000);
  localStorage.setItem(AUTH_EXPIRY_KEY, newExpiryTime.toString());

  return true;
} 
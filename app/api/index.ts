import axios from 'axios';
const api_key="sk-ghbawictopgutrqlcxvhwumjptgjlhzenhjqmpbesouowcsa"
// 充钱的能用的api
const api = axios.create({
  baseURL: 'https://api.siliconflow.cn/v1',
  headers: {
    'Authorization': `Bearer ${api_key}`,
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(config => {
  console.log(config);
  
  return config;
});

// 添加响应拦截器，只返回 已经翻译好的文本
api.interceptors.response.use(
  response => {
    // 成功响应，返回 已经翻译好的文本
    return response.data.choices[0].message.content.trim();
  },
  error => {
    // 错误响应，依然抛出错误
    return Promise.reject(error);
  }
);

export default api;
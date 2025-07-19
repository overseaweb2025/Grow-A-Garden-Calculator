import api from '../index';

const body = {
    "stream": false,
    "max_tokens": 2000,
    "enable_thinking": true,
    "thinking_budget": 4096,
    "min_p": 0.05,
    "temperature": 0.7,
    "top_p": 0.7,
    "top_k": 50,
    "frequency_penalty": 0.5,
    "n": 1,
    "stop": [],
  } 

export const siliconflow = (messsage: string ,model: string = 'Qwen/Qwen2.5-VL-72B-Instruct')=>{
    const messages = [
        {
            role: 'user',
            content: messsage
        }
    ]
    const requestBody = {...body,  model,messages}
    return api.post('/chat/completions', requestBody)
}
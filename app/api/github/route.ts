// GitHub Issues API 集成 - Next.js App Router
import { NextRequest, NextResponse } from 'next/server';

interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
}

interface IssueData {
  title: string;
  body: string;
  labels?: string[];
}

interface BlogPostData {
  translations: Record<string, any>;
  coverImage: string;
  tags: string[];
  data: string;
  slug: string;
  userImage: string;
  username: string;
}

// GitHub API 基础配置
const GITHUB_CONFIG: GitHubConfig = {
  token: process.env.NEXT_PUBLIC_GITHUB_TOKEN || '',
  owner: process.env.NEXT_PUBLIC_GITHUB_OWNER || '',
  repo: process.env.NEXT_PUBLIC_GITHUB_REPO || ''
};

// 发布博客文章到 GitHub Issues
async function publishToGitHubIssues(postData: BlogPostData): Promise<any> {
  const { token, owner, repo } = GITHUB_CONFIG;
  
  if (!token || !owner || !repo) {
    throw new Error('GitHub configuration is missing. Please set GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO environment variables.');
  }

  // 获取当前语言的内容作为标题
  const currentLangContent = Object.values(postData.translations).find(content => 
    content && content.title && content.title.trim() !== ''
  ) || { title: 'Untitled Post', description: '' };

  // 准备Issue数据
  const issueData: IssueData = {
    title: `📝 ${currentLangContent.title}`,
    body: `## 博客文章数据

\`\`\`json
${JSON.stringify(postData, null, 2)}
\`\`\`

---

**发布信息:**
- 📅 发布时间: ${new Date(postData.data).toLocaleString('zh-CN')}
- 👤 作者: ${postData.username}
- 🏷️ 标签: ${postData.tags.join(', ')}
- 🔗 Slug: \`${postData.slug}\`

**描述:**
${currentLangContent.description || '暂无描述'}`,
    labels: ['blog-post', ...postData.tags.slice(0, 3)] // 限制标签数量
  };

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(issueData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`GitHub API Error: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }

    const result = await response.json();
    return {
      success: true,
      issueNumber: result.number,
      issueUrl: result.html_url,
      apiUrl: result.url,
      title: result.title,
      createdAt: result.created_at
    };
  } catch (error) {
    throw error;
  }
}

// 获取所有博客文章 Issues
async function getBlogPostsFromGitHubIssues(): Promise<any[]> {
  const { token, owner, repo } = GITHUB_CONFIG;
  
  if (!token || !owner || !repo) {
    throw new Error('GitHub configuration is missing.');
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues?labels=blog-post&state=open&sort=created&direction=desc`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`GitHub API Error: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }

    const issues = await response.json();
    
    // 解析每个Issue中的JSON数据
    const blogPosts = issues.map((issue: any) => {
      try {
        // 从Issue body中提取JSON数据
        const jsonMatch = issue.body.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
          const postData = JSON.parse(jsonMatch[1]);
          return {
            issueNumber: issue.number,
            issueUrl: issue.html_url,
            createdAt: issue.created_at,
            updatedAt: issue.updated_at,
            title: issue.title,
            labels: issue.labels.map((label: any) => label.name),
            ...postData
          };
        }
        return null;
      } catch (error) {
        return null;
      }
    }).filter(Boolean);

    return blogPosts;
  } catch (error) {
    throw error;
  }
}

// 根据Issue号获取特定博客文章
async function getBlogPostByIssueNumber(issueNumber: number): Promise<any> {
  const { token, owner, repo } = GITHUB_CONFIG;
  
  if (!token || !owner || !repo) {
    throw new Error('GitHub configuration is missing.');
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`GitHub API Error: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }

    const issue = await response.json();
    
    // 解析JSON数据
    const jsonMatch = issue.body.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      const postData = JSON.parse(jsonMatch[1]);
      return {
        issueNumber: issue.number,
        issueUrl: issue.html_url,
        createdAt: issue.created_at,
        updatedAt: issue.updated_at,
        title: issue.title,
        labels: issue.labels.map((label: any) => label.name),
        ...postData
      };
    }

    throw new Error('No valid JSON data found in issue body');
  } catch (error) {
    throw error;
  }
}

// POST 请求处理 - 发布博客文章
export async function POST(request: NextRequest) {
  try {
    const postData = await request.json();
    const result = await publishToGitHubIssues(postData);
    
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { 
      status: 500 
    });
  }
}

// GET 请求处理 - 获取博客文章
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const issueNumber = searchParams.get('issue');
    
    if (issueNumber) {
      const result = await getBlogPostByIssueNumber(parseInt(issueNumber));
      return NextResponse.json(result, { status: 200 });
    } else {
      const result = await getBlogPostsFromGitHubIssues();
      return NextResponse.json(result, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { 
      status: 500 
    });
  }
} 
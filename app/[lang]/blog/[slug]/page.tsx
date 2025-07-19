'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MdPreview } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useI18n, Language, supportedLanguages } from '@/lib/i18n';

// 博客文章接口
interface BlogPost {
  issueNumber: number;
  issueUrl: string;
  title: string;
  slug: string;
  translations: Record<string, any>;
  coverImage: string;
  tags: string[];
  username: string;
  userImage: string;
  data: string;
  createdAt: string;
  labels: string[];
}

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t, setLanguage } = useI18n();
  const slug = params.slug as string;
  const lang = params.lang as Language;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [currentLanguage, setCurrentLanguage] = useState(lang || 'en');

  // 设置语言基于URL参数
  useEffect(() => {
    if (lang && supportedLanguages.includes(lang)) {
      setLanguage(lang);
      setCurrentLanguage(lang);
    }
  }, [lang, setLanguage]);

  // 获取博客文章数据
  const fetchBlogPost = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/github');
      const data = await response.json();
      
      if (data.success === false) {
        throw new Error(data.error || 'Failed to fetch blog posts');
      }
      
      // 根据slug查找对应的文章
      const foundPost = data.find((p: BlogPost) => p.slug === slug);
      if (!foundPost) {
        throw new Error('Blog post not found');
      }
      
      setPost(foundPost);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchBlogPost();
    }
  }, [slug]);

  // 获取当前语言的内容
  const getCurrentLanguageContent = (language: string = currentLanguage) => {
    if (!post) return { title: '', description: '', content: '' };
    
    const content = post.translations?.[language] || post.translations?.['en'] || post.translations?.['zh'];
    return {
      title: content?.title || 'Untitled',
      description: content?.description || 'No description available',
      content: content?.content || 'No content available'
    };
  };

  // 计算阅读时间（基于字数）
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  // 分享功能
  const handleShare = () => {
    if (navigator.share && post) {
      navigator.share({
        title: getCurrentLanguageContent().title,
        text: getCurrentLanguageContent().description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // 返回功能
  const handleBack = () => {
    router.push(`/${lang}/blog`);
  };

  // 语言切换功能
  const handleLanguageChange = (newLang: string) => {
    setCurrentLanguage(newLang);
    router.push(`/${newLang}/blog/${slug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="w-16 h-8 bg-gray-200 rounded"></div>
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
          
          {/* Cover image skeleton */}
          <div className="w-full max-w-2xl mx-auto mt-8 aspect-video bg-gray-200 rounded-2xl"></div>
          
          {/* Content skeleton */}
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">😔</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error === 'Blog post not found' ? 'Post Not Found' : 'Error Loading Post'}
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            <Button onClick={handleBack} variant="outline">
              ← Back
            </Button>
            <Button onClick={fetchBlogPost}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const content = getCurrentLanguageContent();
  const readingTime = calculateReadingTime(content.content);

  return (
    <div className="min-h-screen bg-white">
      {/* 完全匹配图片1的Header布局 */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-white sticky top-0 z-10">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="flex items-center gap-2 hover:bg-gray-100 text-gray-600 font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19-7-7 7-7"/>
            <path d="M19 12H5"/>
          </svg>
          Back
        </Button>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleShare}
            className="hover:bg-gray-100 text-gray-600 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/>
              <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>
            </svg>
            Share
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="hover:bg-gray-100 text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="hover:bg-gray-100 text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
            </svg>
          </Button>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        
        {/* 匹配图片1的Cover Image - 居中显示，圆角 */}
        {post.coverImage && (
          <div className="mb-8">
            <div className="relative w-full max-w-2xl mx-auto">
              <img 
                src={post.coverImage} 
                alt={content.title}
                className="w-full h-auto object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>
        )}

        {/* 匹配图片1和图片2的标题布局 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            {content.title}
          </h1>
        </div>

        {/* 匹配图片2的作者信息和元数据布局 */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
              {post.userImage ? (
                <img 
                  src={post.userImage} 
                  alt={post.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
              )}
            </div>
            <div>
              <div className="font-semibold text-gray-900">{post.username}</div>
              <div className="text-sm text-gray-500">
                <span>📅 {new Date(post.data || post.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span>⏱️ {readingTime} min read</span>
            <a 
              href={post.issueUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-gray-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                <path d="M9 18c-4.51 2-5-2-7-2"/>
              </svg>
              Issue #{post.issueNumber}
            </a>
          </div>
        </div>

        {/* 匹配图片2的标签布局 */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  className="bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-full px-3 py-1 text-sm font-medium border-0"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Language Selector - 如果有多种语言 */}
        {post.translations && Object.keys(post.translations).length > 1 && (
          <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-semibold text-gray-700">🌐 Available Languages:</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {Object.keys(post.translations).map((langCode) => {
                const content = post.translations[langCode];
                if (!content?.title) return null;
                
                const languageNames: Record<string, string> = {
                  'zh': '中文',
                  'en': 'English',
                  'es': 'Español',
                  'fr': 'Français',
                  'fil': 'Filipino',
                  'ru': 'Русский',
                  'vi': 'Tiếng Việt',
                  'hi': 'हिन्दी'
                };
                
                return (
                  <button
                    key={langCode}
                    onClick={() => handleLanguageChange(langCode)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      currentLanguage === langCode 
                        ? 'bg-purple-600 text-white shadow-md transform scale-105' 
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    {languageNames[langCode] || langCode.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 文章内容 - 匹配图片2的布局和样式 */}
        <div className="prose prose-lg max-w-none">
          {/* 匹配图片2的紫色副标题 */}
          <h2 className="text-2xl font-bold text-purple-600 mb-6 mt-8">
            {content.title}
          </h2>
          
          <style jsx global>{`
            .md-preview-wrapper {
              background: transparent !important;
              padding: 0 !important;
              box-shadow: none !important;
            }
            
            .md-preview {
              background: white !important;
              color: #374151 !important;
              line-height: 1.8 !important;
              font-size: 16px !important;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
            }
            
            .md-preview h1, .md-preview h2, .md-preview h3, .md-preview h4, .md-preview h5, .md-preview h6 {
              color: #1f2937 !important;
              font-weight: 700 !important;
              margin-top: 2.5rem !important;
              margin-bottom: 1.25rem !important;
              line-height: 1.3 !important;
            }
            
            .md-preview h1 {
              font-size: 2.25rem !important;
              color: #7c3aed !important;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 0.75rem;
            }
            
            .md-preview h2 {
              font-size: 1.875rem !important;
              color: #7c3aed !important;
            }
            
            .md-preview h3 {
              font-size: 1.5rem !important;
              color: #4f46e5 !important;
            }
            
            .md-preview p {
              margin-bottom: 1.5rem !important;
              text-align: justify;
              color: #374151 !important;
            }
            
            .md-preview strong {
              font-weight: 700 !important;
              color: #1f2937 !important;
            }
            
            .md-preview em {
              font-style: italic !important;
              color: #6b7280 !important;
            }
            
            .md-preview img {
              max-width: 100% !important;
              height: auto !important;
              border-radius: 12px !important;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
              margin: 2rem auto !important;
              display: block !important;
            }
            
            .md-preview code {
              background-color: #f3f4f6 !important;
              color: #d97706 !important;
              padding: 0.25rem 0.5rem !important;
              border-radius: 6px !important;
              font-size: 0.875rem !important;
              font-family: 'Fira Code', 'Monaco', 'Cascadia Code', 'Roboto Mono', monospace !important;
            }
            
            .md-preview pre {
              background-color: #1f2937 !important;
              color: #f9fafb !important;
              padding: 1.5rem !important;
              border-radius: 12px !important;
              overflow-x: auto !important;
              margin: 2rem 0 !important;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
            }
            
            .md-preview pre code {
              background: transparent !important;
              color: inherit !important;
              padding: 0 !important;
            }
            
            .md-preview blockquote {
              border-left: 4px solid #7c3aed !important;
              margin: 2rem 0 !important;
              padding-left: 1.5rem !important;
              color: #6b7280 !important;
              font-style: italic !important;
              background-color: #f8fafc !important;
              padding: 1rem 1.5rem !important;
              border-radius: 8px !important;
            }
            
            .md-preview ul, .md-preview ol {
              padding-left: 2rem !important;
              margin-bottom: 1.5rem !important;
            }
            
            .md-preview li {
              margin-bottom: 0.75rem !important;
              line-height: 1.7 !important;
            }
            
            .md-preview a {
              color: #7c3aed !important;
              text-decoration: none !important;
              border-bottom: 1px solid #c4b5fd !important;
              transition: all 0.2s ease !important;
            }
            
            .md-preview a:hover {
              color: #5b21b6 !important;
              border-bottom-color: #7c3aed !important;
            }
            
            .md-preview table {
              width: 100% !important;
              border-collapse: collapse !important;
              margin: 2rem 0 !important;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
              border-radius: 8px !important;
              overflow: hidden !important;
            }
            
            .md-preview th, .md-preview td {
              padding: 0.75rem 1rem !important;
              text-align: left !important;
              border-bottom: 1px solid #e5e7eb !important;
            }
            
            .md-preview th {
              background-color: #f3f4f6 !important;
              font-weight: 600 !important;
              color: #374151 !important;
            }
            
            @media (max-width: 768px) {
              .md-preview img {
                width: 100% !important;
                max-width: 100% !important;
                margin: 1.5rem auto !important;
              }
              
              .md-preview {
                font-size: 15px !important;
              }
              
              .md-preview h1 {
                font-size: 1.875rem !important;
              }
              
              .md-preview h2 {
                font-size: 1.5rem !important;
              }
              
              .md-preview pre {
                padding: 1rem !important;
                margin: 1.5rem -1rem !important;
                border-radius: 0 !important;
              }
            }
          `}</style>
          
          <MdPreview
            modelValue={content.content}
            theme="light"
            previewTheme="default"
            codeTheme="atom"
          />
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-2 hover:bg-purple-50 hover:border-purple-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"/>
                  <circle cx="6" cy="12" r="3"/>
                  <circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/>
                  <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>
                </svg>
                Share Article
              </Button>
            </div>
            
            <Button onClick={handleBack} variant="outline" className="hover:bg-gray-50">
              ← Back to Blog
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
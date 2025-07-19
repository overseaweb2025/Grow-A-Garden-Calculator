'use client';

import { useI18n } from '@/lib/i18n';
import AnimatedPage from '@/components/animated-page';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

export default function BlogPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // 获取博客文章数据
  const fetchBlogPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/github');
      const data = await response.json();
      
      if (data.success === false) {
        throw new Error(data.error || 'Failed to fetch blog posts');
      }
      
      setPosts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  // 获取当前语言的内容
  const getCurrentLanguageContent = (post: BlogPost, language: string = 'en') => {
    const content = post.translations?.[language] || post.translations?.['en'] || post.translations?.['zh'];
    return {
      title: content?.title || 'Untitled',
      description: content?.description || 'No description available'
    };
  };

  // 重定向到多语言版本
  // useEffect(() => {
  //   router.replace(`/en/blog`);
  // }, [router]);

  // 处理文章点击
  const handlePostClick = (post: BlogPost) => {
    // 使用默认语言英语进行重定向
    router.push(`/en/blog/${post.slug}`);
  };

  // 生成随机渐变色
  const getRandomGradient = (index: number) => {
    const gradients = [
      'from-purple-500 via-pink-500 to-red-500',
      'from-pink-500 via-purple-500 to-blue-500',
      'from-blue-500 via-teal-500 to-green-500',
      'from-orange-500 via-red-500 to-pink-500',
      'from-green-500 via-blue-500 to-purple-500',
      'from-indigo-500 via-purple-500 to-pink-500'
    ];
    return gradients[index % gradients.length];
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-50/50 to-pink-100 pt-8 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">📝</span>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-pink-700 bg-clip-text text-transparent">
                Blog
              </h1>
            </div>
            <div className="flex items-center justify-center gap-4 text-sm text-pink-600">
              <div className="flex items-center gap-1">
                <span className="text-lg">📊</span>
                <span>{posts.length} posts</span>
              </div>
              <button 
                onClick={fetchBlogPosts}
                disabled={loading}
                className="flex items-center gap-1 hover:text-pink-700 transition-colors disabled:opacity-50"
              >
                <span className={`text-lg ${loading ? 'animate-spin' : ''}`}>🔄</span>
                <span>{loading ? 'Loading...' : 'Refresh'}</span>
              </button>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="max-w-md mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center">
              <p className="font-medium">Failed to load blog posts</p>
              <p className="text-sm mt-1">{error}</p>
              <button 
                onClick={fetchBlogPosts}
                className="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-sm transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-2xl bg-white shadow-lg animate-pulse">
                  <div className="aspect-video bg-gray-200 rounded-t-2xl"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Blog Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {posts.map((post, index) => {
                const content = getCurrentLanguageContent(post);
                return (
                  <div
                    key={post.issueNumber}
                    onClick={() => handlePostClick(post)}
                    className="rounded-2xl text-card-foreground group overflow-hidden transition-all duration-300 cursor-pointer border-0 bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl hover:-translate-y-1"
                  >
                    {/* Card Image/Header */}
                    <div className="relative aspect-video overflow-hidden rounded-t-2xl">
                      {post.coverImage ? (
                        <img 
                          src={post.coverImage} 
                          alt={content.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${getRandomGradient(index)} flex items-center justify-center`}>
                          <span className="text-white text-2xl font-bold">
                            {content.title.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                      
                      {/* Top left badge */}
                      <div className="absolute top-3 left-3">
                        <a 
                          href={post.issueUrl}
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 rounded-md gap-1 bg-black/70 hover:bg-black/80 text-white border-0 backdrop-blur-sm text-xs px-2 py-1 h-auto"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github w-3 h-3">
                            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                            <path d="M9 18c-4.51 2-5-2-7-2"></path>
                          </svg>
                          #{post.issueNumber}
                        </a>
                      </div>

                      {/* Top right action buttons */}
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-accent-foreground rounded-md w-8 h-8 p-0 backdrop-blur-sm transition-colors bg-white/20 hover:bg-white/30 text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart w-4 h-4">
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                          </svg>
                        </button>
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-accent-foreground rounded-md w-8 h-8 p-0 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bookmark w-4 h-4">
                            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {content.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">
                        {content.description}
                      </p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag, tagIndex) => (
                          <div key={tagIndex} className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-secondary/80 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-xs">
                            {tag}
                          </div>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <div className="relative w-6 h-6">
                            {post.userImage ? (
                              <img 
                                src={post.userImage} 
                                alt={post.username}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user w-3 h-3">
                                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                  <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                              </div>
                            )}
                          </div>
                          <span className="font-medium">{post.username}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar w-4 h-4">
                            <path d="M8 2v4"></path>
                            <path d="M16 2v4"></path>
                            <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                            <path d="M3 10h18"></path>
                          </svg>
                          <span>{new Date(post.data || post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && posts.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No blog posts found</h3>
              <p className="text-gray-600 mb-4">There are no blog posts available at the moment.</p>
              <button 
                onClick={fetchBlogPosts}
                className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
              >
                Refresh
              </button>
            </div>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
} 
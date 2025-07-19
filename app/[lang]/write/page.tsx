'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useI18n, Language, supportedLanguages } from '@/lib/i18n';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MdEditor, MdPreview } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import { images } from '@/lib/images';
import { siliconflow } from '@/app/api/siliconflow';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import { useProtectedRoute } from '@/hooks/use-auth';

export default function WritePage() {
  const { t, setLanguage } = useI18n();
  const params = useParams();
  const lang = params.lang as Language;
  const { isAuthenticated, isLoading } = useProtectedRoute('/admin');
  
  // 设置语言基于URL参数
  useEffect(() => {
    if (lang && supportedLanguages.includes(lang)) {
      setLanguage(lang);
    }
  }, [lang, setLanguage]);
  
  // 所有的useState必须在条件判断之前调用
  const [formData, setFormData] = useState({
    username: '',
    title: '',
    description: '',
    content: '',
    coverImage: '',
    userImage: '', // 对应 userAvatar
    tags: [] as string[],
    currentTag: '',
    language: lang || 'en',
    data: new Date().toISOString(),
    slug: ''
  });

  const [imageSelector, setImageSelector] = useState({
    isOpen: false,
    type: '' as 'avatar' | 'cover' | ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPostFormatOpen, setIsPostFormatOpen] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<Record<string, any>>({});
  const [isSlugGenerating, setIsSlugGenerating] = useState(false);
  const [generatedSlug, setGeneratedSlug] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  // 从本地存储加载草稿
  useEffect(() => {
    const savedDraft = localStorage.getItem('blog-draft');
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        if (draftData.formData) {
          setFormData(draftData.formData);
        }
        if (draftData.translatedContent) {
          setTranslatedContent(draftData.translatedContent);
        }
      } catch (error) {
        // 加载草稿失败，忽略错误
      }
    }
  }, []);

  const handleAddTag = () => {
    if (formData.currentTag.trim() && !formData.tags.includes(formData.currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.currentTag.trim()],
        currentTag: ''
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ';') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // 生成符合URL规范的slug
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // 移除特殊字符
      .replace(/\s+/g, '-') // 空格替换为连字符
      .replace(/-+/g, '-') // 多个连字符合并为一个
      .replace(/^-|-$/g, ''); // 移除开头和结尾的连字符
  };

  // 检查文本是否主要是英文
  const isEnglishText = (text: string) => {
    // 匹配英文字母的正则表达式
    const englishRegex = /[a-zA-Z]/g;
    const englishMatches = text.match(englishRegex);
    const englishCount = englishMatches ? englishMatches.length : 0;
    const totalCount = text.replace(/\s/g, '').length;
    
    // 如果英文字符占50%以上，认为是英文文本
    return totalCount > 0 && (englishCount / totalCount) > 0.5;
  };

  // 智能生成URL slug
  const generateSmartSlug = async (title: string) => {
    if (!title.trim()) {
      setGeneratedSlug('');
      return;
    }

    setIsSlugGenerating(true);

    try {
      let englishTitle = title;

      // 如果不是英文文本，则翻译为英文
      if (!isEnglishText(title)) {
        try {
          const prompt = `请将以下标题翻译成英文，只返回英文翻译结果，不要包含任何其他文字：

标题：${title}

要求：
- 只返回英文翻译
- 适合用作URL slug
- 简洁明了
- 不要引号或特殊格式`;

          const aiResult = await siliconflow(prompt);
          
          if (aiResult) {
            englishTitle = String(aiResult).trim();
          }
        } catch (error) {
          // 翻译失败，使用原标题
        }
      }

      // 生成符合URL规范的slug
      let slug = englishTitle
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // 只保留字母、数字、空格和连字符
        .replace(/\s+/g, '-') // 空格替换为连字符
        .replace(/-+/g, '-') // 多个连字符合并为一个
        .replace(/^-|-$/g, ''); // 移除开头和结尾的连字符

      // 如果slug为空或太短，使用时间戳
      if (!slug || slug.length < 3) {
        slug = `post-${Date.now()}`;
      }

      setGeneratedSlug(slug);
    } catch (error) {
      // 如果出错，使用简单的slug生成
      const fallbackSlug = generateSlug(title) || `post-${Date.now()}`;
      setGeneratedSlug(fallbackSlug);
    } finally {
      setIsSlugGenerating(false);
    }
  };

  // 监听标题变化，自动生成slug
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      generateSmartSlug(formData.title);
    }, 500); // 防抖，500ms后执行

    return () => clearTimeout(debounceTimer);
  }, [formData.title]);

  // 打开图片选择器
  const openImageSelector = (type: 'avatar' | 'cover') => {
    setImageSelector({ isOpen: true, type });
  };

  // 关闭图片选择器
  const closeImageSelector = () => {
    setImageSelector({ isOpen: false, type: '' });
  };

  // 选择图片
  const selectImage = (imageSrc: string | any) => {
    const src = typeof imageSrc === 'string' ? imageSrc : imageSrc.src;
    if (imageSelector.type === 'avatar') {
      setFormData(prev => ({ ...prev, userImage: src }));
    } else if (imageSelector.type === 'cover') {
      setFormData(prev => ({ ...prev, coverImage: src }));
    }
    closeImageSelector();
  };

  // 处理AI生成
  const handleAIGenerate = async () => {
    if (!formData.content.trim()) {
      toast.error("请先编写一些文章内容，然后再生成标题和描述。");
      return;
    }

    if (isGenerating) {
      return; // 防止重复点击
    }

    setIsGenerating(true);

    try {
      // 获取语言映射
      const languageMap: Record<string, string> = {
        'en': 'English',
        'zh': 'Chinese (Simplified)',
        'fr': 'French',
        'es': 'Spanish',
        'fil': 'Filipino',
        'ru': 'Russian',
        'vi': 'Vietnamese',
        'hi': 'Hindi'
      };

      const targetLanguage = languageMap[formData.language] || 'English';
      
      // 构建提示词
      const prompt = `请阅读以下文章内容，并生成最好的标题和描述，使用${targetLanguage}语言。

文章内容：
${formData.content}

请以JSON格式返回结果，不要包含任何其他文字：
{
  "title": "生成的标题",
  "description": "生成的描述（最多150字符）"
}

要求：
- 标题要吸引人且适合SEO
- 描述要简洁明了，能够吸引读者
- 必须使用${targetLanguage}语言
- 只返回有效的JSON格式，不要其他内容`;

      // 调用AI API
      const aiResult = await siliconflow(prompt);
      
      if (aiResult) {
        try {
          // 尝试解析JSON
          const resultString = String(aiResult).trim();
          const parsedResult = JSON.parse(resultString);
          
          if (parsedResult.title && parsedResult.description) {
            // 更新表单数据
            setFormData(prev => ({
              ...prev,
              title: parsedResult.title,
              description: parsedResult.description
            }));
            
            toast.success("AI已成功生成标题和描述！");
          } else {
            throw new Error('Invalid response format - missing title or description');
          }
        } catch (parseError) {
          toast.error("无法解析AI响应，请重试。");
        }
      } else {
        throw new Error('No response from AI API');
      }
    } catch (error) {
      toast.error("内容生成失败，请重试。");
    } finally {
      setIsGenerating(false);
    }
  };

  // 保存草稿
  const handleSaveDraft = () => {
    try {
      const draftData = {
        formData: formData,
        translatedContent: translatedContent
      };
      localStorage.setItem('blog-draft', JSON.stringify(draftData));
      toast.success("您的文章草稿已成功保存到本地。");
    } catch (error) {
      toast.error("草稿保存失败，请重试。");
    }
  };

  // 生成POST格式数据
  const generatePostFormat = () => {
    // 使用智能生成的slug，如果没有则生成一个
    const slug = generatedSlug || generateSlug(formData.title) || `post-${Date.now()}`;

    // 支持的语言列表
    const supportedLanguages = ['zh', 'en', 'es', 'fr', 'fil', 'ru', 'vi', 'hi'];
    
    // 构建translations对象
    const translations: Record<string, any> = {};
    
    supportedLanguages.forEach(lang => {
      if (translatedContent[lang]) {
        // 如果有翻译内容，使用翻译内容
        translations[lang] = translatedContent[lang];
      } else if (lang === formData.language) {
        // 当前选择的语言，填入实际数据
        translations[lang] = {
          title: formData.title,
          description: formData.description,
          content: formData.content
        };
      } else {
        // 其他语言，显示空的占位符
        translations[lang] = {
          title: "",
          description: "",
          content: ""
        };
      }
    });

    // 构建完整的POST格式数据
    const postData = {
      translations: translations,
      coverImage: formData.coverImage || "/images/placeholder-cover.jpg",
      tags: formData.tags,
      data: new Date().toISOString(),
      slug: slug,
      userImage: formData.userImage || images.avatars.avatar5,
      username: formData.username || "Anonymous"
    };

    return postData;
  };

  // 处理翻译功能
  const handleTranslate = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("请至少填写标题和内容后再进行翻译。");
      return;
    }

    if (isTranslating) {
      return; // 防止重复点击
    }

    setIsTranslating(true);

    try {
      // 语言映射
      const languageMap: Record<string, string> = {
        'zh': 'Chinese (Simplified)',
        'en': 'English',
        'es': 'Spanish',
        'fr': 'French',
        'fil': 'Filipino',
        'ru': 'Russian',
        'vi': 'Vietnamese',
        'hi': 'Hindi'
      };

      // 所有支持的语言
      const allLanguages = ['zh', 'en', 'es', 'fr', 'fil', 'ru', 'vi', 'hi'];
      
      // 需要翻译的语言（排除当前语言）
      const languagesToTranslate = allLanguages.filter(lang => lang !== formData.language);
      
      const currentLanguageName = languageMap[formData.language];
      
      // 初始化翻译结果，包含当前语言的原始内容
      const translations: Record<string, any> = {};
      
      // 初始化所有语言的空结构
      allLanguages.forEach(lang => {
        if (lang === formData.language) {
          // 当前语言保持原内容
          translations[lang] = {
            title: formData.title,
            description: formData.description,
            content: formData.content
          };
        } else {
          // 其他语言初始化为空
          translations[lang] = {
            title: '',
            description: '',
            content: ''
          };
        }
      });

      // 显示开始翻译的toast
      toast("正在翻译内容，请稍候...");

      // 分步骤翻译：1. 标题，2. 描述，3. 内容
      const fields = [
        { key: 'title', name: '标题', value: formData.title },
        { key: 'description', name: '描述', value: formData.description },
        { key: 'content', name: '内容', value: formData.content }
      ];

      for (const field of fields) {
        // 翻译当前字段的所有语言
        for (const targetLang of languagesToTranslate) {
          const targetLanguageName = languageMap[targetLang];
          
          const prompt = `请将以下${field.name}从${currentLanguageName}翻译成${targetLanguageName}，保持原意和语调。

原始${field.name}：
${field.value}

只返回翻译后的${field.name}，不要包含任何其他文字或格式。`;

          try {
            const aiResult = await siliconflow(prompt);
            
            if (aiResult) {
              const translatedText = String(aiResult).trim();
              // 更新翻译结果
              translations[targetLang][field.key] = translatedText;
              
              // 显示翻译成功的toast
              toast.success(`${targetLanguageName} ${field.name}翻译完成`);
            } else {
              throw new Error('Empty response');
            }
          } catch (error) {
            translations[targetLang][field.key] = `[${field.name}翻译失败]`;
            
            toast.error(`${targetLanguageName} ${field.name}翻译失败`);
          }
          
          // 实时更新翻译结果
          setTranslatedContent({...translations});
          
          // 添加短暂延迟，避免API频率限制
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      // 显示全部完成的toast
      toast.success(`所有内容已成功翻译为${languagesToTranslate.length}种语言。`);
      
    } catch (error) {
      toast.error("翻译过程中出现错误，请重试。");
    } finally {
      setIsTranslating(false);
    }
  };

  // 处理发布
  const handlePublish = async () => {
    // 验证必填字段
    if (!formData.title.trim()) {
      toast.error('请填写标题');
      return;
    }
    if (!formData.content.trim()) {
      toast.error('请填写内容');
      return;
    }

    setIsPublishing(true);

    try {
      // 生成POST格式数据
      const postFormatData = generatePostFormat();
      
      // 调用GitHub API发布到Issues
      const response = await fetch('/api/github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postFormatData)
      });

      const result = await response.json();

      if (result.success) {
        // 发布成功
        toast.success(`🎉 发布成功！Issue #${result.issueNumber} 已创建`);
        
        // 清除草稿缓存和翻译内容
        localStorage.removeItem('blog-draft');
        setTranslatedContent({});
        setGeneratedSlug('');
        
        // 重置表单
        setFormData({
          username: '',
          title: '',
          description: '',
          content: '',
          coverImage: '',
          tags: [],
          currentTag: '',
          language: lang || 'en',
          userImage: '',
          data: new Date().toISOString(),
          slug: ''
        });

        // 显示GitHub链接信息
        setTimeout(() => {
          toast.success(`🔗 查看Issues: ${result.issueUrl}`);
        }, 1000);

      } else {
        // 发布失败
        toast.error(`发布失败: ${result.error || '未知错误'}`);
      }

    } catch (error) {
      toast.error(`发布过程中出现错误: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsPublishing(false);
    }
  };

  // 如果正在验证登录状态，显示加载页面
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">正在验证登录状态...</p>
        </div>
      </div>
    );
  }
  
  // 如果未登录，不渲染页面内容（useProtectedRoute 会自动重定向）
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
    <main className="flex-grow min-h-screen flex flex-col pt-20 bg-pink-100">
      {/* Top Toolbar */}
      <div>
        <div className="container mx-auto px-6 py-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center space-x-3">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current Language
                </Label>
                <Select value={formData.language} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, language: value }))
                }>
                  <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 rounded-xl">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="en">English Version</SelectItem>
                    <SelectItem value="zh">中文版本</SelectItem>
                    <SelectItem value="es">Versión en Español</SelectItem>
                    <SelectItem value="fr">Version Française</SelectItem>
                    <SelectItem value="fil">Filipino Version</SelectItem>
                    <SelectItem value="ru">Русская версия</SelectItem>
                    <SelectItem value="vi">Phiên bản tiếng Việt</SelectItem>
                    <SelectItem value="hi">हिंदी संस्करण</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button 
                  className="gap-2 rounded-xl bg-white text-pink-500 border border-pink-500 hover:bg-pink-50"
                  onClick={handleAIGenerate}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"></path>
                      <path d="m14 7 3 3"></path>
                      <path d="M5 6v4"></path>
                      <path d="M19 14v4"></path>
                      <path d="M10 2v2"></path>
                      <path d="M7 8H3"></path>
                      <path d="M21 16h-4"></path>
                      <path d="M11 3H9"></path>
                    </svg>
                  )}
                  {isGenerating ? 'Generating...' : 'AI Generate'}
                </Button>
                <Button 
                  className="gap-2 rounded-xl bg-white text-pink-500 border border-pink-500 hover:bg-pink-50"
                  onClick={() => setIsPreviewOpen(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  Preview
                </Button>
                <Button 
                  className="gap-2 rounded-xl bg-white text-pink-500 border border-pink-500 hover:bg-pink-50"
                  onClick={handleTranslate}
                  disabled={isTranslating}
                >
                  {isTranslating ? (
                    <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="m5 8 6 6"></path>
                      <path d="m4 14 6-6 2-3"></path>
                      <path d="M2 5h12"></path>
                      <path d="M7 2h1"></path>
                      <path d="m22 22-5-10-5 10"></path>
                      <path d="M14 18h6"></path>
                    </svg>
                  )}
                  {isTranslating ? 'Translating...' : 'Translate'}
                </Button>
                <Button 
                  className="gap-2 rounded-xl bg-white text-pink-500 border border-pink-500 hover:bg-pink-50"
                  onClick={handleSaveDraft}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path>
                    <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path>
                    <path d="M7 3v4a1 1 0 0 0 1 1h7"></path>
                  </svg>
                  Save Draft
                </Button>
                <Button 
                  className="gap-2 rounded-xl bg-white text-pink-500 border border-pink-500 hover:bg-pink-50"
                  onClick={handlePublish}
                  disabled={isPublishing}
                >
                  {isPublishing ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                        <line x1="4" x2="4" y1="22" y2="15"></line>
                      </svg>
                      Publish
                    </>
                  )}
                </Button>
                <Button 
                  className="gap-2 rounded-xl bg-white text-pink-500 border border-pink-500 hover:bg-pink-50"
                  onClick={() => setIsPostFormatOpen(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                    <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                    <path d="M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1"></path>
                    <path d="M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1"></path>
                  </svg>
                  Show POST Format
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-8">
              <div className="space-y-6">
                {/* Username */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Username</Label>
                  <Input
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="rounded-xl"
                />
                </div>

                {/* User Avatar */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">User Avatar</Label>
                    <Button 
                      size="sm" 
                      className="gap-2 rounded-xl bg-white text-pink-500 border-pink-500 border-[1px] hover:bg-pink-50"
                      onClick={() => openImageSelector('avatar')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                        <circle cx="9" cy="9" r="2"></circle>
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                      </svg>
                      Choose Avatar
                    </Button>
                  </div>
                  <Input
                    placeholder="Enter custom avatar URL"
                    value={formData.userImage}
                    onChange={(e) => setFormData(prev => ({ ...prev, userImage: e.target.value }))}
                    className="rounded-xl"
                  />
                  {formData.userImage && (
                    <div className="flex justify-center">
                      <div className="relative w-24 h-24">
                        <img
                          alt="User avatar"
                          className="rounded-full object-cover border-2 border-gray-200 dark:border-gray-700 w-full h-full"
                          src={formData.userImage}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Cover Image */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">Cover Image</Label>
                    <Button 
                      size="sm" 
                      className="gap-2 rounded-xl bg-white text-pink-500 border-pink-500 border-[1px] hover:bg-pink-50"
                      onClick={() => openImageSelector('cover')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                        <circle cx="9" cy="9" r="2"></circle>
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                      </svg>
                      Choose Cover
                    </Button>
                  </div>
                  <Input
                    placeholder="Enter cover image URL"
                    value={formData.coverImage}
                    onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
                    className="rounded-xl"
                  />
                  {formData.coverImage && (
                    <div className="relative aspect-video">
                      <img
                        alt="Cover preview"
                        className="object-cover rounded-xl border border-gray-200 dark:border-gray-700 w-full h-full"
                        src={formData.coverImage}
                      />
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Tags</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type and press Enter, or use ; to separate"
                        value={formData.currentTag}
                        onChange={(e) => setFormData(prev => ({ ...prev, currentTag: e.target.value }))}
                        onKeyPress={handleKeyPress}
                        className="rounded-xl"
                      />
                      <Button
                        size="sm"
                        onClick={handleAddTag}
                        disabled={!formData.currentTag.trim()}
                        className="w-10 h-10 p-0 rounded-xl bg-white text-pink-500 border-pink-500 border-[1px] hover:bg-pink-50"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                          <path d="M5 12h14"></path>
                          <path d="M12 5v14"></path>
                        </svg>
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {formData.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer rounded-xl"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          {tag}
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-3 w-3">
                            <path d="M18 6 6 18"></path>
                            <path d="m6 6 12 12"></path>
                          </svg>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            {/* Title and Description */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Title</Label>
                <Input
                  className="text-lg rounded-xl"
                  placeholder="Enter blog title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-medium">Description</Label>
                <Input
                  placeholder="Enter blog description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="rounded-xl"
                />
              </div>
              
              {/* Slug Preview */}
              {formData.title && (
                <div className="space-y-2 p-3 bg-gray-50 rounded-xl border">
                  <Label className="text-xs font-medium text-gray-600">URL Slug Preview:</Label>
                  <div className="text-sm font-mono break-all flex items-center gap-2">
                    {isSlugGenerating ? (
                      <>
                        <svg className="h-4 w-4 animate-spin text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-gray-500">Generating slug...</span>
                      </>
                    ) : (
                      <span className="text-blue-600">/{generatedSlug || `post-${Date.now()}`}</span>
                    )}
                  </div>
                  {!isSlugGenerating && !isEnglishText(formData.title) && generatedSlug && (
                    <div className="text-xs text-green-600">
                      ✓ Translated to English for SEO-friendly URL
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Content Editor */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-3">
              <Label className="text-sm font-medium">Content</Label>
              <div className="rounded-xl overflow-hidden">
                <MdEditor
                  modelValue={formData.content}
                  onChange={(value: string) => setFormData(prev => ({ ...prev, content: value }))}
                  language="en-US"
                  placeholder="Start writing your blog content in Markdown..."
                  theme="light"
                  previewTheme="default"
                  codeTheme="atom"
                  style={{ minHeight: '500px' }}
                  toolbars={[
                    'bold',
                    'underline', 
                    'italic',
                    'strikeThrough',
                    '-',
                    'title',
                    'sub',
                    'sup',
                    'quote',
                    'unorderedList',
                    'orderedList',
                    'task',
                    '-',
                    'codeRow',
                    'code',
                    'link',
                    'image',
                    'table',
                    'mermaid',
                    'katex',
                    '-',
                    'revoke',
                    'next',
                    'save',
                    '=',
                    'pageFullscreen',
                    'fullscreen',
                    'preview',
                    'htmlPreview',
                    'catalog'
                  ]}
                  footers={['markdownTotal', '=', 'scrollSwitch']}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 图片选择器模态框 */}
      {imageSelector.isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            {/* 模态框头部 */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">
                {imageSelector.type === 'avatar' ? 'Choose Avatar' : 'Choose Cover'}
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={closeImageSelector}
                className="rounded-xl"
              >
                Close
              </Button>
            </div>

            {/* 图片网格 */}
            <div className="p-6">
              {imageSelector.type === 'avatar' ? (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {Object.entries(images.avatars).map(([key, src]) => (
                                       <div
                     key={key}
                     className="aspect-square rounded-full overflow-hidden cursor-pointer border-2 border-gray-200 hover:border-orange-500 transition-colors"
                     onClick={() => selectImage(src)}
                   >
                     <img
                       src={typeof src === 'string' ? src : src.src}
                       alt={`Avatar ${key}`}
                       className="w-full h-full object-cover"
                     />
                   </div>
                ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(images.covers).map(([key, src]) => (
                                       <div
                     key={key}
                     className="aspect-video rounded-xl overflow-hidden cursor-pointer border-2 border-gray-200 hover:border-orange-500 transition-colors"
                     onClick={() => selectImage(src)}
                   >
                     <img
                       src={typeof src === 'string' ? src : src.src}
                       alt={`Cover ${key}`}
                       className="w-full h-full object-cover"
                     />
                   </div>
                ))}
                </div>
              )}
            </div>

            {/* 确认按钮 */}
            <div className="p-6 border-t">
              <Button 
                onClick={closeImageSelector}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-8"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 预览模态框 */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* 预览头部 */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Preview Article</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsPreviewOpen(false)}
                className="rounded-xl"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </Button>
            </div>

            {/* 预览内容 */}
            <div className="p-6">
              {/* 文章标题 */}
              <h1 className="text-3xl font-bold mb-6">
                {formData.title || 'Untitled Article'}
              </h1>

              {/* 封面图片 */}
              {formData.coverImage && (
                <div className="mb-6">
                  <img
                    src={formData.coverImage}
                    alt="Cover"
                    className="w-full aspect-video object-cover rounded-xl"
                  />
                </div>
              )}

              {/* 作者信息 */}
              <div className="flex items-center gap-3 mb-8 pb-6 border-b">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={formData.userImage || images.avatars.avatar5}
                    alt="Author"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold">{formData.username || 'Anonymous'}</div>
                  <div className="text-gray-600 text-sm">
                    {new Date().toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>

              {/* 文章内容 */}
              <div className="prose prose-lg max-w-none">
                <MdPreview
                  modelValue={formData.content || 'No content yet...'}
                  theme="light"
                  previewTheme="default"
                  codeTheme="atom"
                />
              </div>
            </div>
          </div>
                 </div>
       )}

      {/* POST格式模态框 */}
      {isPostFormatOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* POST格式头部 */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">POST Format Data</h2>
              <div className="flex items-center gap-3">
                <Button 
                  size="sm"
                  className="gap-2 rounded-xl bg-pink-500 text-white hover:bg-pink-600"
                  onClick={() => {
                    const postData = generatePostFormat();
                    navigator.clipboard.writeText(JSON.stringify(postData, null, 2));
                    toast.success("POST格式数据已复制到剪贴板。");
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                  </svg>
                  Copy
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsPostFormatOpen(false)}
                  className="rounded-xl"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                </Button>
              </div>
            </div>

            {/* POST格式内容 */}
            <div className="p-6">
              <div className="bg-gray-50 rounded-xl p-4 overflow-x-auto">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                  {JSON.stringify(generatePostFormat(), null, 2)}
                </pre>
              </div>
              
              {/* 说明文字 */}
              <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">Format Explanation:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• <strong>translations</strong>: Contains content in multiple languages (zh, en, es, fr, fil, ru, vi, hi)</li>
                  <li>• <strong>Current language ({formData.language})</strong>: Filled with actual content</li>
                  <li>• <strong>Translation status</strong>: {Object.keys(translatedContent).length > 1 ? `Translated into ${Object.keys(translatedContent).length - 1} languages` : 'No translations yet - click Translate button'}</li>
                  <li>• <strong>slug</strong>: URL-friendly identifier generated from English title</li>
                  <li>• <strong>data</strong>: Publication timestamp in ISO format</li>
                </ul>
              </div>
            </div>
          </div>
                 </div>
       )}
    </main>
    <Toaster position="top-center" />
    </>
  );
}
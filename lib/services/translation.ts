import { siliconflow } from '@/app/api/siliconflow';
import { localStorageService, WikiCard, WikiContent } from '../storage/local-storage';

// 语言映射表
const LANGUAGE_MAP = {
  'zh': '中文',
  'en': '英文',
  'fr': '法文',
  'fil': '菲律宾语',
  'ru': '俄文',
  'es': '西班牙文',
  'vi': '越南文',
  'hi': '印地文'
} as const;

// 翻译服务
export class TranslationService {
  // 翻译文章内容
  static async translateContent(content: string, targetLanguage: keyof typeof LANGUAGE_MAP): Promise<string> {
    const prompt = `请将以下文本翻译为${LANGUAGE_MAP[targetLanguage]}，保持Markdown格式和表情符号不变：\n\n${content}`;
    const response = await siliconflow(prompt);
    const translatedText = response.data;
    console.log(`翻译为${LANGUAGE_MAP[targetLanguage]}的结果:`, translatedText);
    return translatedText;
  }

  // 翻译文章标题
  static async translateTitle(title: string, targetLanguage: keyof typeof LANGUAGE_MAP): Promise<string> {
    const prompt = `请将以下标题翻译为${LANGUAGE_MAP[targetLanguage]}：\n\n${title}`;
    const response = await siliconflow(prompt);
    const translatedText = response.data;
    console.log(`标题翻译为${LANGUAGE_MAP[targetLanguage]}的结果:`, translatedText);
    return translatedText;
  }

  // 翻译并保存文章
  static async translateAndSaveArticle(
    sourceCard: WikiCard,
    sourceContent: string,
    targetLanguage: keyof typeof LANGUAGE_MAP
  ): Promise<WikiCard> {
    try {
      console.log(`开始将文章翻译为${LANGUAGE_MAP[targetLanguage]}...`);

      // 翻译标题和内容
      const [translatedTitle, translatedContent] = await Promise.all([
        this.translateTitle(sourceCard.title, targetLanguage),
        this.translateContent(sourceContent, targetLanguage)
      ]);

      // 创建新的卡片
      const translatedCard: WikiCard = {
        ...sourceCard,
        title: translatedTitle,
        language: targetLanguage
      };

      // 保存翻译后的文章
      localStorageService.saveWiki(translatedCard, translatedContent);
      console.log(`文章已成功翻译并保存为${LANGUAGE_MAP[targetLanguage]}版本`);

      return translatedCard;
    } catch (error) {
      console.error(`翻译到${LANGUAGE_MAP[targetLanguage]}失败:`, error);
      throw error;
    }
  }

  // 获取所有可用的翻译语言
  static getAvailableLanguages(): Array<{ code: keyof typeof LANGUAGE_MAP; name: string }> {
    return Object.entries(LANGUAGE_MAP).map(([code, name]) => ({
      code: code as keyof typeof LANGUAGE_MAP,
      name
    }));
  }

  // 检查文章是否已经有特定语言的翻译
  static hasTranslation(articleId: string, language: string): boolean {
    return localStorageService.getWikiCard(articleId, language) !== null;
  }

  // 获取文章的所有可用翻译
  static getAvailableTranslations(articleId: string): string[] {
    const allCards = localStorageService.getWikiCards();
    return allCards
      .filter(card => card.id === articleId)
      .map(card => card.language);
  }
} 
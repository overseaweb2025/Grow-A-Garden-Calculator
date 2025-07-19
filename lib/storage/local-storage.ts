import { INITIAL_CONTENT } from './initial-content';

// 本地存储的键名
const STORAGE_KEYS = {
  WIKI_CARDS: 'garden_wiki_cards',
  WIKI_CONTENT: 'garden_wiki_content',
  INITIALIZED: 'garden_wiki_initialized',
} as const;

// Wiki 卡片类型
export interface WikiCard {
  id: string;
  title: string;
  image: string;
  date: string;
  category: string;
  readTime: number;
  language: string;
}

// Wiki 内容类型
export interface WikiContent {
  id: string;
  content: string;
  language: string;
}

// 初始示例卡片
export const INITIAL_CARDS: WikiCard[] = [];

// 本地存储服务
class LocalStorageService {
  private static instance: LocalStorageService;

  private constructor() {
    // 在构造函数中初始化示例内容
    if (typeof window !== 'undefined') {
      this.initializeContent();
    }
  }

  // 初始化示例内容
  private initializeContent(): void {
    // 检查是否已经初始化过
    if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
      // 保存示例卡片
      INITIAL_CARDS.forEach(card => {
        this.saveWikiCard(card);
      });

      // 保存示例内容
      INITIAL_CONTENT.forEach(content => {
        this.saveWikiContent(content);
      });

      // 标记为已初始化
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  }

  // 单例模式
  public static getInstance(): LocalStorageService {
    if (!LocalStorageService.instance) {
      LocalStorageService.instance = new LocalStorageService();
    }
    return LocalStorageService.instance;
  }

  // 保存 Wiki 卡片
  public saveWikiCard(card: WikiCard): void {
    if (typeof window === 'undefined') return;
    const cards = this.getWikiCards();
    const existingIndex = cards.findIndex(c => c.id === card.id && c.language === card.language);
    
    if (existingIndex !== -1) {
      cards[existingIndex] = card;
    } else {
      cards.push(card);
    }

    localStorage.setItem(STORAGE_KEYS.WIKI_CARDS, JSON.stringify(cards));
  }

  // 获取所有 Wiki 卡片
  public getWikiCards(): WikiCard[] {
    if (typeof window === 'undefined') return [];
    const cardsJson = localStorage.getItem(STORAGE_KEYS.WIKI_CARDS);
    return cardsJson ? JSON.parse(cardsJson) : [];
  }

  // 获取特定语言的 Wiki 卡片
  public getWikiCardsByLanguage(language: string): WikiCard[] {
    return this.getWikiCards().filter(card => card.language === language);
  }

  // 获取特定 ID 和语言的 Wiki 卡片
  public getWikiCard(id: string, language: string): WikiCard | null {
    return this.getWikiCards().find(card => card.id === id && card.language === language) || null;
  }

  // 删除 Wiki 卡片
  public deleteWikiCard(id: string, language: string): void {
    if (typeof window === 'undefined') return;
    const cards = this.getWikiCards().filter(
      card => !(card.id === id && card.language === language)
    );
    localStorage.setItem(STORAGE_KEYS.WIKI_CARDS, JSON.stringify(cards));
  }

  // 保存 Wiki 内容
  public saveWikiContent(content: WikiContent): void {
    if (typeof window === 'undefined') return;
    const contents = this.getWikiContents();
    const existingIndex = contents.findIndex(
      c => c.id === content.id && c.language === content.language
    );
    
    if (existingIndex !== -1) {
      contents[existingIndex] = content;
    } else {
      contents.push(content);
    }

    localStorage.setItem(STORAGE_KEYS.WIKI_CONTENT, JSON.stringify(contents));
  }

  // 获取所有 Wiki 内容
  public getWikiContents(): WikiContent[] {
    if (typeof window === 'undefined') return [];
    const contentsJson = localStorage.getItem(STORAGE_KEYS.WIKI_CONTENT);
    return contentsJson ? JSON.parse(contentsJson) : [];
  }

  // 获取特定 ID 和语言的 Wiki 内容
  public getWikiContent(id: string, language: string): WikiContent | null {
    return this.getWikiContents().find(
      content => content.id === id && content.language === language
    ) || null;
  }

  // 删除 Wiki 内容
  public deleteWikiContent(id: string, language: string): void {
    if (typeof window === 'undefined') return;
    const contents = this.getWikiContents().filter(
      content => !(content.id === id && content.language === language)
    );
    localStorage.setItem(STORAGE_KEYS.WIKI_CONTENT, JSON.stringify(contents));
  }

  // 保存完整的 Wiki（卡片和内容）
  public saveWiki(card: WikiCard, content: string): void {
    this.saveWikiCard(card);
    this.saveWikiContent({
      id: card.id,
      content,
      language: card.language
    });
  }

  // 删除完整的 Wiki（卡片和内容）
  public deleteWiki(id: string, language: string): void {
    this.deleteWikiCard(id, language);
    this.deleteWikiContent(id, language);
  }

  // 重置所有数据
  public reset(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.WIKI_CARDS);
    localStorage.removeItem(STORAGE_KEYS.WIKI_CONTENT);
    localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
    this.initializeContent();
  }
}

export const localStorageService = LocalStorageService.getInstance(); 
import dynamic from 'next/dynamic';

const ValuesPage = dynamic(() => import('../[lang]/values/page'), { ssr: false });

export default function ValuesRootPage() {
  // 这里可以强制设置语言为 en，如果 [lang]/values/page.tsx 支持 props 传递，可以传递 lang="en"
  // 否则 useI18n 默认就是 en
  return <ValuesPage />;
} 
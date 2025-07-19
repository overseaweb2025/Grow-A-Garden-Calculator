import dynamic from 'next/dynamic';

const GearPage = dynamic(() => import('../[lang]/gear/page'), { ssr: false });

export default function GearRootPage() {
  return <GearPage />;
} 
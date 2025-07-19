import dynamic from 'next/dynamic';

const TradeCalculatorPage = dynamic(() => import('../[lang]/trade-calculator/page'), { ssr: false });

export default function TradeCalculatorRootPage() {
  return <TradeCalculatorPage />;
} 
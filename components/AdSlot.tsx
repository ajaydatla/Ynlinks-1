'use client';

import { useEffect, useRef, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface AdSlotProps {
  position: 'header' | 'sidebar' | 'footer';
  adCode?: string;
}

export function AdSlot({ position, adCode: providedAdCode }: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [adCode, setAdCode] = useState<string>('');

  const globalAdCode = useQuery(api.admin.getSettingByKey, { key: `ad_code_${position}` });

  useEffect(() => {
    if (providedAdCode) {
      setAdCode(providedAdCode);
    } else if (globalAdCode?.value) {
      setAdCode(globalAdCode.value);
    }
  }, [providedAdCode, globalAdCode]);

  useEffect(() => {
    if (!adCode || !containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = adCode;

    const scripts = container.getElementsByTagName('script');
    Array.from(scripts).forEach((script) => {
      const newScript = document.createElement('script');
      Array.from(script.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.textContent = script.textContent || '';
      script.parentNode?.replaceChild(newScript, script);
    });
  }, [adCode]);

  if (!adCode) return null;

  const getPositionStyles = () => {
    switch (position) {
      case 'header':
        return 'w-full max-w-6xl mx-auto mb-6';
      case 'sidebar':
        return 'w-full lg:w-80 sticky top-4';
      case 'footer':
        return 'w-full max-w-6xl mx-auto mt-8';
      default:
        return '';
    }
  };

  return (
    <div className={`ad-slot ${getPositionStyles()}`}>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[100px] flex items-center justify-center">
        <div ref={containerRef} className="w-full" />
      </div>
    </div>
  );
}

export default AdSlot;
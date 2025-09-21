'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const AIAssistant = dynamic(() => import('@/components/pages/AIAssistant').then(mod => mod.AIAssistant), { ssr: false });

const AIAssistantPage = () => {
  return <AIAssistant />;
};

export default AIAssistantPage;

'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const WhatsAppWarmer = dynamic(() => import('@/components/pages/WhatsAppWarmer'), { ssr: false });

const WhatsAppWarmerPage = () => {
  return <WhatsAppWarmer />;
};

export default WhatsAppWarmerPage;

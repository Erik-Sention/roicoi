"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormAData } from '@/lib/utils/reportGenerator';
import { AppendixFormA } from './AppendixFormA';
import { AppendixFormB } from './AppendixFormB';
import { AppendixFormC } from './AppendixFormC';
import { AppendixFormD } from './AppendixFormD';
import { AppendixFormE } from './AppendixFormE';
import { AppendixFormF } from './AppendixFormF';
import { AppendixFormG } from './AppendixFormG';

interface ReportAppendixProps {
  formData: FormAData;
  language?: 'sv' | 'en';
}

export function ReportAppendix({ formData, language = 'sv' }: ReportAppendixProps) {
  const [activeTab, setActiveTab] = useState('form-a');
  
  // Translation helper
  const t = (sv: string, en: string): string => {
    return language === 'sv' ? sv : en;
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('Appendix - Ifyllda formulär', 'Appendix - Completed Forms')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-7 mb-4">
            <TabsTrigger value="form-a">
              {t('Formulär A', 'Form A')}
            </TabsTrigger>
            <TabsTrigger value="form-b" disabled={!formData.B3 && !formData.B4}>
              {t('Formulär B', 'Form B')}
            </TabsTrigger>
            <TabsTrigger value="form-c" disabled={!formData.C7 && !formData.C20}>
              {t('Formulär C', 'Form C')}
            </TabsTrigger>
            <TabsTrigger value="form-d" disabled={!formData.D1 && !formData.D4}>
              {t('Formulär D', 'Form D')}
            </TabsTrigger>
            <TabsTrigger value="form-e" disabled={!formData.E1 && !formData.E8}>
              {t('Formulär E', 'Form E')}
            </TabsTrigger>
            <TabsTrigger value="form-f" disabled={!formData.F1 && !formData.F8}>
              {t('Formulär F', 'Form F')}
            </TabsTrigger>
            <TabsTrigger value="form-g" disabled={!formData.G1 && !formData.G34_total}>
              {t('Formulär G', 'Form G')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="form-a" className="mt-0">
            <AppendixFormA formData={formData} language={language} />
          </TabsContent>
          
          <TabsContent value="form-b" className="mt-0">
            <AppendixFormB formData={formData} language={language} />
          </TabsContent>
          
          <TabsContent value="form-c" className="mt-0">
            <AppendixFormC formData={formData} language={language} />
          </TabsContent>
          
          <TabsContent value="form-d" className="mt-0">
            <AppendixFormD formData={formData} language={language} />
          </TabsContent>
          
          <TabsContent value="form-e" className="mt-0">
            <AppendixFormE formData={formData} language={language} />
          </TabsContent>
          
          <TabsContent value="form-f" className="mt-0">
            <AppendixFormF formData={formData} language={language} />
          </TabsContent>
          
          <TabsContent value="form-g" className="mt-0">
            <AppendixFormG formData={formData} language={language} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 
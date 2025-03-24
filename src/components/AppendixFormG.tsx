"use client";

import { FormCard } from "@/components/ui/form-card";
import { FormAData } from "@/lib/utils/reportGenerator";

interface AppendixFormGProps {
  formData: FormAData;
  language?: 'sv' | 'en';
}

export function AppendixFormG({ formData, language = 'sv' }: AppendixFormGProps) {
  // Translation helper
  const t = (sv: string, en: string): string => {
    return language === 'sv' ? sv : en;
  };

  // Helper function to format numbers with thousand separators
  const formatNumber = (value: string | number | undefined | null): string => {
    if (value === undefined || value === null || value === '') {
      return '';
    }
    
    const num = typeof value === 'string' ? parseFloat(value.replace(/\s/g, '').replace(',', '.')) : value;
    if (isNaN(num)) {
      return '';
    }
    
    return num.toLocaleString(language === 'sv' ? 'sv-SE' : 'en-US');
  };

  return (
    <div className="space-y-6 print:text-black">
      <FormCard id="G" label={t("Kostnader för insatser", "Costs for interventions")}>
        <div className="border rounded-md overflow-hidden">
          <table className="w-full border-collapse">
            <tbody>
              {/* Basic Information */}
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 w-24 font-medium">G1</td>
                <td className="border-r p-3 w-1/2">{t("Organisationens namn:", "Organization name:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formData.G1 || ''}
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">G2</td>
                <td className="border-r p-3">{t("Kontaktperson:", "Contact person:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formData.G2 || ''}
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">G3</td>
                <td className="border-r p-3">{t("Tidsperiod (12 månader):", "Time period (12 months):")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formData.G3_start || ''} - {formData.G3_end || ''}
                  </div>
                </td>
              </tr>
              
              {/* Insats 1 */}
              <tr className="border-b bg-muted/10">
                <td colSpan={3} className="p-3 font-medium">
                  {t("Insats 1", "Intervention 1")}
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">G4</td>
                <td className="border-r p-3">{t("Insatsnamn:", "Intervention name:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formData.G4_name || ''}
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">G5</td>
                <td className="border-r p-3">{t("Delinsats 1.1:", "Sub-intervention 1.1:")}</td>
                <td className="p-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-gray-50 rounded border col-span-1">
                      {formData.G5_name || ''}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Externa:", "External:")} {formatNumber(formData.G5_external || '')} {t('kr', 'SEK')}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Interna:", "Internal:")} {formatNumber(formData.G5_internal || '')} {t('kr', 'SEK')}
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">G6</td>
                <td className="border-r p-3">{t("Delinsats 1.2:", "Sub-intervention 1.2:")}</td>
                <td className="p-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-gray-50 rounded border col-span-1">
                      {formData.G6_name || ''}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Externa:", "External:")} {formatNumber(formData.G6_external || '')} {t('kr', 'SEK')}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Interna:", "Internal:")} {formatNumber(formData.G6_internal || '')} {t('kr', 'SEK')}
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">G7</td>
                <td className="border-r p-3">{t("Delinsats 1.3:", "Sub-intervention 1.3:")}</td>
                <td className="p-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-gray-50 rounded border col-span-1">
                      {formData.G7_name || ''}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Externa:", "External:")} {formatNumber(formData.G7_external || '')} {t('kr', 'SEK')}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Interna:", "Internal:")} {formatNumber(formData.G7_internal || '')} {t('kr', 'SEK')}
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">G8</td>
                <td className="border-r p-3">{t("Delinsats 1.4:", "Sub-intervention 1.4:")}</td>
                <td className="p-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-gray-50 rounded border col-span-1">
                      {formData.G8_name || ''}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Externa:", "External:")} {formatNumber(formData.G8_external || '')} {t('kr', 'SEK')}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Interna:", "Internal:")} {formatNumber(formData.G8_internal || '')} {t('kr', 'SEK')}
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-b bg-muted/5">
                <td className="border-r p-3 bg-muted/20 font-medium">G9</td>
                <td className="border-r p-3 font-medium">{t("Delsumma 1:", "Subtotal 1:")}</td>
                <td className="p-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-gray-50 rounded border col-span-1 font-medium">
                      {t("Totalt:", "Total:")} {formatNumber(formData.G9_total || '')} {t('kr', 'SEK')}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border font-medium">
                      {t("Externa:", "External:")} {formatNumber(formData.G9_external || '')} {t('kr', 'SEK')}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border font-medium">
                      {t("Interna:", "Internal:")} {formatNumber(formData.G9_internal || '')} {t('kr', 'SEK')}
                    </div>
                  </div>
                </td>
              </tr>
              
              {/* Insats 2 */}
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">G10</td>
                <td className="border-r p-3">{t("Insatsnamn:", "Intervention name:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formData.G10_name || ''}
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">G11</td>
                <td className="border-r p-3">{t("Delinsats 2.1:", "Sub-intervention 2.1:")}</td>
                <td className="p-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-gray-50 rounded border col-span-1">
                      {formData.G11_name || ''}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Externa:", "External:")} {formatNumber(formData.G11_external || '')} {t('kr', 'SEK')}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Interna:", "Internal:")} {formatNumber(formData.G11_internal || '')} {t('kr', 'SEK')}
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">G12</td>
                <td className="border-r p-3">{t("Delinsats 2.2:", "Sub-intervention 2.2:")}</td>
                <td className="p-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-gray-50 rounded border col-span-1">
                      {formData.G12_name || ''}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Externa:", "External:")} {formatNumber(formData.G12_external || '')} {t('kr', 'SEK')}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Interna:", "Internal:")} {formatNumber(formData.G12_internal || '')} {t('kr', 'SEK')}
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">G13</td>
                <td className="border-r p-3">{t("Delinsats 2.3:", "Sub-intervention 2.3:")}</td>
                <td className="p-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-gray-50 rounded border col-span-1">
                      {formData.G13_name || ''}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Externa:", "External:")} {formatNumber(formData.G13_external || '')} {t('kr', 'SEK')}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Interna:", "Internal:")} {formatNumber(formData.G13_internal || '')} {t('kr', 'SEK')}
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">G14</td>
                <td className="border-r p-3">{t("Delinsats 2.4:", "Sub-intervention 2.4:")}</td>
                <td className="p-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-gray-50 rounded border col-span-1">
                      {formData.G14_name || ''}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Externa:", "External:")} {formatNumber(formData.G14_external || '')} {t('kr', 'SEK')}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Interna:", "Internal:")} {formatNumber(formData.G14_internal || '')} {t('kr', 'SEK')}
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-b bg-muted/5">
                <td className="border-r p-3 bg-muted/20 font-medium">G15</td>
                <td className="border-r p-3 font-medium">{t("Delsumma 2:", "Subtotal 2:")}</td>
                <td className="p-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-gray-50 rounded border col-span-1 font-medium">
                      {t("Totalt:", "Total:")} {formatNumber(formData.G15_total || '')} {t('kr', 'SEK')}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border font-medium">
                      {t("Externa:", "External:")} {formatNumber(formData.G15_external || '')} {t('kr', 'SEK')}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border font-medium">
                      {t("Interna:", "Internal:")} {formatNumber(formData.G15_internal || '')} {t('kr', 'SEK')}
                    </div>
                  </div>
                </td>
              </tr>
              
              {/* Insats 3 */}
              <tr className="border-b bg-muted/10">
                <td colSpan={3} className="p-3 font-medium">
                  {t("Insats 3", "Intervention 3")}
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">G16</td>
                <td className="border-r p-3">{t("Insatsnamn:", "Intervention name:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formData.G16_name || ''}
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">G17</td>
                <td className="border-r p-3">{t("Delinsats 3.1:", "Sub-intervention 3.1:")}</td>
                <td className="p-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-gray-50 rounded border col-span-1">
                      {formData.G17_name || ''}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Externa:", "External:")} {formatNumber(formData.G17_external || '')} {t('kr', 'SEK')}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Interna:", "Internal:")} {formatNumber(formData.G17_internal || '')} {t('kr', 'SEK')}
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">G18</td>
                <td className="border-r p-3">{t("Delinsats 3.2:", "Sub-intervention 3.2:")}</td>
                <td className="p-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-gray-50 rounded border col-span-1">
                      {formData.G18_name || ''}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Externa:", "External:")} {formatNumber(formData.G18_external || '')} {t('kr', 'SEK')}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Interna:", "Internal:")} {formatNumber(formData.G18_internal || '')} {t('kr', 'SEK')}
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">G19</td>
                <td className="border-r p-3">{t("Delinsats 3.3:", "Sub-intervention 3.3:")}</td>
                <td className="p-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-gray-50 rounded border col-span-1">
                      {formData.G19_name || ''}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Externa:", "External:")} {formatNumber(formData.G19_external || '')} {t('kr', 'SEK')}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Interna:", "Internal:")} {formatNumber(formData.G19_internal || '')} {t('kr', 'SEK')}
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">G20</td>
                <td className="border-r p-3">{t("Delinsats 3.4:", "Sub-intervention 3.4:")}</td>
                <td className="p-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-gray-50 rounded border col-span-1">
                      {formData.G20_name || ''}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Externa:", "External:")} {formatNumber(formData.G20_external || '')} {t('kr', 'SEK')}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Interna:", "Internal:")} {formatNumber(formData.G20_internal || '')} {t('kr', 'SEK')}
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-b bg-muted/5">
                <td className="border-r p-3 bg-muted/20 font-medium">G21</td>
                <td className="border-r p-3 font-medium">{t("Delsumma 3:", "Subtotal 3:")}</td>
                <td className="p-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-gray-50 rounded border col-span-1 font-medium">
                      {t("Totalt:", "Total:")} {formatNumber(formData.G21_total || '')} {t('kr', 'SEK')}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border font-medium">
                      {t("Externa:", "External:")} {formatNumber(formData.G21_external || '')} {t('kr', 'SEK')}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border font-medium">
                      {t("Interna:", "Internal:")} {formatNumber(formData.G21_internal || '')} {t('kr', 'SEK')}
                    </div>
                  </div>
                </td>
              </tr>
              
              {/* Insats 4 */}
              <tr className="border-b bg-muted/10">
                <td colSpan={3} className="p-3 font-medium">
                  {t("Insats 4", "Intervention 4")}
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">G22</td>
                <td className="border-r p-3">{t("Insatsnamn:", "Intervention name:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formData.G22_name || ''}
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">G23</td>
                <td className="border-r p-3">{t("Delinsats 4.1:", "Sub-intervention 4.1:")}</td>
                <td className="p-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-gray-50 rounded border col-span-1">
                      {formData.G23_name || ''}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Externa:", "External:")} {formatNumber(formData.G23_external || '')} {t('kr', 'SEK')}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Interna:", "Internal:")} {formatNumber(formData.G23_internal || '')} {t('kr', 'SEK')}
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">G24</td>
                <td className="border-r p-3">{t("Delinsats 4.2:", "Sub-intervention 4.2:")}</td>
                <td className="p-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-gray-50 rounded border col-span-1">
                      {formData.G24_name || ''}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Externa:", "External:")} {formatNumber(formData.G24_external || '')} {t('kr', 'SEK')}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Interna:", "Internal:")} {formatNumber(formData.G24_internal || '')} {t('kr', 'SEK')}
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">G25</td>
                <td className="border-r p-3">{t("Delinsats 4.3:", "Sub-intervention 4.3:")}</td>
                <td className="p-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-gray-50 rounded border col-span-1">
                      {formData.G25_name || ''}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Externa:", "External:")} {formatNumber(formData.G25_external || '')} {t('kr', 'SEK')}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Interna:", "Internal:")} {formatNumber(formData.G25_internal || '')} {t('kr', 'SEK')}
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">G26</td>
                <td className="border-r p-3">{t("Delinsats 4.4:", "Sub-intervention 4.4:")}</td>
                <td className="p-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-gray-50 rounded border col-span-1">
                      {formData.G26_name || ''}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Externa:", "External:")} {formatNumber(formData.G26_external || '')} {t('kr', 'SEK')}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Interna:", "Internal:")} {formatNumber(formData.G26_internal || '')} {t('kr', 'SEK')}
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-b bg-muted/5">
                <td className="border-r p-3 bg-muted/20 font-medium">G27</td>
                <td className="border-r p-3 font-medium">{t("Delsumma 4:", "Subtotal 4:")}</td>
                <td className="p-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-gray-50 rounded border col-span-1 font-medium">
                      {t("Totalt:", "Total:")} {formatNumber(formData.G27_total || '')} {t('kr', 'SEK')}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border font-medium">
                      {t("Externa:", "External:")} {formatNumber(formData.G27_external || '')} {t('kr', 'SEK')}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border font-medium">
                      {t("Interna:", "Internal:")} {formatNumber(formData.G27_internal || '')} {t('kr', 'SEK')}
                    </div>
                  </div>
                </td>
              </tr>
              
              {/* Insats 5 */}
              <tr className="border-b bg-muted/10">
                <td colSpan={3} className="p-3 font-medium">
                  {t("Insats 5", "Intervention 5")}
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">G28</td>
                <td className="border-r p-3">{t("Insatsnamn:", "Intervention name:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formData.G28_name || ''}
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">G29</td>
                <td className="border-r p-3">{t("Delinsats 5.1:", "Sub-intervention 5.1:")}</td>
                <td className="p-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-gray-50 rounded border col-span-1">
                      {formData.G29_name || ''}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Externa:", "External:")} {formatNumber(formData.G29_external || '')} {t('kr', 'SEK')}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Interna:", "Internal:")} {formatNumber(formData.G29_internal || '')} {t('kr', 'SEK')}
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">G30</td>
                <td className="border-r p-3">{t("Delinsats 5.2:", "Sub-intervention 5.2:")}</td>
                <td className="p-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-gray-50 rounded border col-span-1">
                      {formData.G30_name || ''}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Externa:", "External:")} {formatNumber(formData.G30_external || '')} {t('kr', 'SEK')}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Interna:", "Internal:")} {formatNumber(formData.G30_internal || '')} {t('kr', 'SEK')}
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">G31</td>
                <td className="border-r p-3">{t("Delinsats 5.3:", "Sub-intervention 5.3:")}</td>
                <td className="p-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-gray-50 rounded border col-span-1">
                      {formData.G31_name || ''}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Externa:", "External:")} {formatNumber(formData.G31_external || '')} {t('kr', 'SEK')}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Interna:", "Internal:")} {formatNumber(formData.G31_internal || '')} {t('kr', 'SEK')}
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">G32</td>
                <td className="border-r p-3">{t("Delinsats 5.4:", "Sub-intervention 5.4:")}</td>
                <td className="p-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-gray-50 rounded border col-span-1">
                      {formData.G32_name || ''}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Externa:", "External:")} {formatNumber(formData.G32_external || '')} {t('kr', 'SEK')}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {t("Interna:", "Internal:")} {formatNumber(formData.G32_internal || '')} {t('kr', 'SEK')}
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-b bg-muted/5">
                <td className="border-r p-3 bg-muted/20 font-medium">G33</td>
                <td className="border-r p-3 font-medium">{t("Delsumma 5:", "Subtotal 5:")}</td>
                <td className="p-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-gray-50 rounded border col-span-1 font-medium">
                      {t("Totalt:", "Total:")} {formatNumber(formData.G33_total || '')} {t('kr', 'SEK')}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border font-medium">
                      {t("Externa:", "External:")} {formatNumber(formData.G33_external || '')} {t('kr', 'SEK')}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border font-medium">
                      {t("Interna:", "Internal:")} {formatNumber(formData.G33_internal || '')} {t('kr', 'SEK')}
                    </div>
                  </div>
                </td>
              </tr>
              
              {/* Total for all interventions */}
              <tr className="border-b bg-muted/5">
                <td className="border-r p-3 bg-muted/20 font-medium">G34</td>
                <td className="border-r p-3 font-medium">{t("TOTALT ALLA INSATSER:", "TOTAL ALL INTERVENTIONS:")}</td>
                <td className="p-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-gray-50 rounded border col-span-1 font-medium">
                      {t("Totalt:", "Total:")} {formatNumber(formData.G34_total || '')} {t('kr', 'SEK')}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border font-medium">
                      {t("Externa:", "External:")} {formatNumber(formData.G34_external || '')} {t('kr', 'SEK')}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border font-medium">
                      {t("Interna:", "Internal:")} {formatNumber(formData.G34_internal || '')} {t('kr', 'SEK')}
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </FormCard>
    </div>
  );
} 
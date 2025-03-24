import Link from "next/link";
import { FormStepper } from "@/components/ui/form-stepper";
import { Button } from "@/components/ui/button";

export default function FormsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container py-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">ROI Analysverktyg</h1>
        <Link href="/dashboard">
          <Button variant="outline" size="sm">
            Tillbaka till Dashboard
          </Button>
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Formulär</h2>
        <p className="text-muted-foreground mb-6">
          Fyll i formulären i ordning för att beräkna ROI för insatser mot psykisk ohälsa på arbetsplatsen.
          Du kan när som helst navigera mellan formulären genom att klicka på stegen nedan.
        </p>
        
        <FormStepper />
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border p-6">
        {children}
      </div>
      
      <div className="mt-6 flex justify-end">
        <Link href="/reports">
          <Button>
            Generera rapport
          </Button>
        </Link>
      </div>
    </div>
  );
} 
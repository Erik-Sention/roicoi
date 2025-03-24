"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";

interface FormStep {
  id: string;
  label: string;
  path: string;
  description?: string;
  icon?: React.ReactNode;
}

const formSteps: FormStep[] = [
  { id: "A", label: "A", path: "/forms/form-a", description: "Verksamhetsanalys" },
  { id: "B", label: "B", path: "/forms/form-b", description: "Insats" },
  { id: "C", label: "C", path: "/forms/form-c", description: "Ekonomi" },
  { id: "D", label: "D", path: "/forms/form-d", description: "Personal" },
  { id: "E", label: "E", path: "/forms/form-e", description: "Kort sjukfrånvaro" },
  { id: "F", label: "F", path: "/forms/form-f", description: "Lång sjukfrånvaro" },
  { id: "G", label: "G", path: "/forms/form-g", description: "Insatskostnader" },
  { id: "H", label: "H", path: "/forms/form-h", description: "Externa kostnader" },
  { id: "I", label: "I", path: "/forms/form-i", description: "Interna kostnader" },
  { id: "J", label: "J", path: "/forms/form-j", description: "ROI" },
  { 
    id: "Report", 
    label: "", 
    path: "/reports", 
    description: "Generera rapport", 
    icon: <FileText className="h-5 w-5" /> 
  },
];

export function FormStepper() {
  const pathname = usePathname();
  
  // Determine current step
  const currentStepIndex = formSteps.findIndex(step => step.path === pathname);
  
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {formSteps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <div className="flex items-center w-full">
              {/* Line before first step */}
              {index > 0 && (
                <div 
                  className={cn(
                    "h-1 w-full", 
                    index <= currentStepIndex ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
              
              {/* Step circle */}
              <Link href={step.path} className="group relative">
                <div 
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-all",
                    pathname === step.path 
                      ? "border-primary bg-primary text-primary-foreground" 
                      : index < currentStepIndex
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted bg-background text-muted-foreground hover:border-primary/50"
                  )}
                >
                  {step.icon || step.label}
                </div>
                
                {/* Tooltip */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-max opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs rounded px-2 py-1 pointer-events-none shadow-sm">
                  {step.description}
                </div>
              </Link>
              
              {/* Line after last step */}
              {index < formSteps.length - 1 && (
                <div 
                  className={cn(
                    "h-1 w-full", 
                    index < currentStepIndex ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
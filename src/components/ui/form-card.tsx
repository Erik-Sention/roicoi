"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormCardProps {
  id: string;
  label: string;
  children: ReactNode;
  className?: string;
}

export function FormCard({ id, label, children, className }: FormCardProps) {
  return (
    <div className={cn("rounded-md border", className)}>
      <div className="flex items-center bg-muted/50 p-3 border-b">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium text-sm mr-3">
          {id}
        </div>
        <h3 className="font-medium">{label}</h3>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={cn("mb-6", className)}>
      <div className="bg-muted/30 p-3 rounded-t-md border border-b-0">
        <h4 className="font-medium">{title}</h4>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <div className="border rounded-b-md">
        {children}
      </div>
    </div>
  );
}

interface FormRowProps {
  id: string;
  label: string;
  children: ReactNode;
  className?: string;
  highlight?: boolean;
}

export function FormRow({ id, label, children, className, highlight = false }: FormRowProps) {
  return (
    <div className={cn(
      "grid grid-cols-[100px_1fr] border-b last:border-b-0",
      highlight && "bg-muted/10",
      className
    )}>
      <div className="bg-muted/20 p-3 font-medium border-r text-sm flex items-center">
        {id}
      </div>
      <div className="grid grid-cols-[1fr_auto]">
        <div className="p-3 border-r">
          {label}
        </div>
        <div className="p-2 min-w-[200px]">
          {children}
        </div>
      </div>
    </div>
  );
} 
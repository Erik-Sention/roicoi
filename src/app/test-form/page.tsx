"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveToRealtimeDB } from "@/lib/firebase/formSubmission";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/context/AuthContext";

export default function TestForm() {
  const [testData, setTestData] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Fel",
        description: "Du måste vara inloggad för att testa",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await saveToRealtimeDB("test-form", { testValue: testData }, user.uid);
      toast({
        title: "Lyckades!",
        description: "Data sparades till Firebase Realtime Database",
      });
      setTestData("");
    } catch (error) {
      console.error("Test error:", error);
      toast({
        title: "Fel",
        description: "Kunde inte spara data till Firebase",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Test Firebase Form</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Test Data</label>
          <Input
            value={testData}
            onChange={(e) => setTestData(e.target.value)}
            placeholder="Ange testdata"
          />
        </div>
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sparar..." : "Spara testdata"}
        </Button>
      </form>
    </div>
  );
} 
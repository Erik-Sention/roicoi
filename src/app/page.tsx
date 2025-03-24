import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">ROI Analysverktyg</CardTitle>
          <CardDescription className="text-center">
            Analysera avkastningen på investeringar för insatser mot psykisk ohälsa på arbetsplatsen
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Välkommen till ROI Analysverktyget. Denna applikation hjälper dig att bedöma den ekonomiska effekten av psykisk ohälsa på arbetsplatsen och beräkna avkastningen på investeringar (ROI) för olika insatser.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/dashboard" passHref>
            <Button size="lg">Kom igång</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

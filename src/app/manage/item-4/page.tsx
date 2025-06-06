// src/app/manage/item-4/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Box } from "lucide-react";

export default function Item4Page() {
  return (
    <div className="animate-fade-in">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Box className="h-10 w-10 text-primary" />
            <CardTitle className="text-4xl font-headline text-primary">Item 4</CardTitle>
          </div>
          <CardDescription className="text-lg text-foreground/80">
            This is a placeholder page for Item 4.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-10">
            Content for Item 4 will be available here soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

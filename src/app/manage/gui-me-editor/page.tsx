// src/app/manage/gui-me-editor/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette } from "lucide-react";

export default function GuiMeEditorPage() {
  return (
    <div className="animate-fade-in">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Palette className="h-10 w-10 text-primary" />
            <CardTitle className="text-4xl font-headline text-primary">GUI ME Editor</CardTitle>
          </div>
          <CardDescription className="text-lg text-foreground/80">
            Welcome to the GUI ME Editor. This section is under construction.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-10">
            Content for the GUI ME Editor will be available here soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SectionCardProps = {
  id?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function SectionCard({
  id,
  title,
  description,
  children,
  className,
}: SectionCardProps) {
  return (
    <Card id={id} className={cn("border-border/80 shadow-sm", className)}>
      <CardHeader>
        <CardTitle className="text-lg text-[#0F172A]">{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

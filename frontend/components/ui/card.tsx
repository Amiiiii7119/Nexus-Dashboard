import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn("glass rounded-2xl", className)}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: CardProps) {
  return <div className={cn("flex items-center justify-between p-5 border-b border-white/5", className)}>{children}</div>;
}

export function CardTitle({ children, className }: CardProps) {
  return <h3 className={cn("text-base font-semibold text-white", className)}>{children}</h3>;
}

export function CardBody({ children, className }: CardProps) {
  return <div className={cn("p-5", className)}>{children}</div>;
}

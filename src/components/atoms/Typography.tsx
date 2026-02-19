import { cn } from "@/lib/utils";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4";
  children: React.ReactNode;
  className?: string;
}

const headingStyles: Record<string, string> = {
  h1: "font-serif font-light leading-none",
  h2: "font-serif font-light leading-tight",
  h3: "font-serif font-light",
  h4: "font-serif font-light",
};

export function Heading({ as: Tag = "h2", children, className, ...rest }: HeadingProps) {
  return (
    <Tag
      className={cn(headingStyles[Tag], "text-foreground", className)}
      style={{ letterSpacing: "var(--tracking-tight)" }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  as?: "p" | "span";
  variant?: "body" | "caption" | "label" | "stat";
}

const textStyles: Record<string, string> = {
  body: "leading-relaxed",
  caption: "leading-relaxed",
  label: "uppercase font-medium",
  stat: "font-serif italic",
};

const textSizeVars: Record<string, string> = {
  body: "var(--type-body)",
  caption: "var(--type-small)",
  label: "var(--type-xs)",
  stat: "var(--type-h3)",
};

const textTrackingVars: Record<string, string> = {
  body: "var(--tracking-normal)",
  caption: "var(--tracking-normal)",
  label: "var(--tracking-wide)",
  stat: "var(--tracking-tight)",
};

export function Text({
  children,
  className,
  as: Tag = "p",
  variant = "body",
  ...rest
}: TextProps) {
  return (
    <Tag
      className={cn(textStyles[variant], variant !== "stat" && "text-muted-foreground", variant === "stat" && "text-foreground", className)}
      style={{
        fontSize: textSizeVars[variant],
        letterSpacing: textTrackingVars[variant],
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

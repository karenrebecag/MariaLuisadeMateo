import { cn } from "@/lib/utils";

interface NavLink {
  label: string;
  href: string;
}

const links: NavLink[] = [
  { label: "Obras", href: "#gallery" },
  { label: "Bio", href: "#bio" },
  { label: "Contacto", href: "#contact" },
];

interface NavLinksProps {
  className?: string;
  direction?: "row" | "column";
  onLinkClick?: () => void;
}

export function NavLinks({ className, direction = "row", onLinkClick }: NavLinksProps) {
  return (
    <nav
      className={cn(
        "flex gap-8",
        direction === "column" ? "flex-col" : "flex-row",
        className
      )}
    >
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          onClick={onLinkClick}
          className="text-xs uppercase text-muted-foreground transition-colors hover:text-foreground"
          style={{ letterSpacing: "var(--tracking-wide)" }}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}

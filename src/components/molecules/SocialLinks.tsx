import { cn } from "@/lib/utils";

interface SocialLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const socials: SocialLink[] = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Behance",
    href: "https://behance.net",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M7.803 5.296H2v13.408h6.082C10.248 18.704 12 17.24 12 15.016c0-1.496-.848-2.568-2.126-2.968 1.008-.504 1.6-1.368 1.6-2.56 0-2.016-1.488-4.192-3.67-4.192zm-.424 5.304H4.8v-2.88h2.58c.96 0 1.68.6 1.68 1.44s-.72 1.44-1.68 1.44zm.192 5.28H4.8v-3.12h2.772c1.104 0 1.92.672 1.92 1.56s-.816 1.56-1.92 1.56zM19.2 5.76h-5.76v1.536h5.76V5.76zM16.32 9.024c-2.832 0-4.464 1.848-4.464 4.368 0 2.616 1.68 4.464 4.512 4.464 2.064 0 3.504-.96 4.128-2.688h-2.16c-.264.624-.888 1.008-1.824 1.008-1.344 0-2.16-.816-2.304-2.16h6.384c.048-.288.048-.528.048-.768 0-2.616-1.728-4.224-4.32-4.224zm-2.136 3.456c.24-1.104.984-1.824 2.088-1.824 1.152 0 1.896.72 2.04 1.824h-4.128z"/>
      </svg>
    ),
  },
  {
    label: "Dribbble",
    href: "https://dribbble.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5">
        <circle cx="12" cy="12" r="10" />
        <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.18 17.72M19.13 5.09C15.22 9.14 10.1 10.44 2.25 10.94M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32" />
      </svg>
    ),
  },
];

interface SocialLinksProps {
  className?: string;
  iconClassName?: string;
}

export function SocialLinks({ className, iconClassName }: SocialLinksProps) {
  return (
    <div className={cn("flex items-center gap-6", className)}>
      {socials.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          className={cn(
            "text-muted-foreground transition-colors hover:text-foreground",
            iconClassName
          )}
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
}

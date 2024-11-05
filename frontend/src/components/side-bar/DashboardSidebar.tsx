import { Tooltip, TooltipTrigger, TooltipContent } from "@/registry/new-york/ui/tooltip";
import { Home, ShoppingCart, Package, Link as LucideLink, Settings } from "lucide-react";

interface Section {
  id: number;
  name: string;
  icon: React.ReactNode;
  href: string;
}

interface Props {
  sections: Section[];
  onSelectSection: () => void;
}

export function DashboardSidebar({ sections, onSelectSection }: Props) {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <LucideLink
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Setup</span>
            </LucideLink>
          </TooltipTrigger>
          <TooltipContent side="right">Setup</TooltipContent>
        </Tooltip>

        {sections.map((section) => (
          <Tooltip key={section.id}>
            <TooltipTrigger asChild>
              <LucideLink
                href={section.href}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                onClick={(e) => {
                  // e.preventDefault(); // Prevent default link behavior
                  onSelectSection; // Call the selection handler
                }}
              >
                {section.icon}
                <span className="sr-only">{section.name}</span>
              </LucideLink>
            </TooltipTrigger>
            <TooltipContent side="right">{section.name}</TooltipContent>
          </Tooltip>
        ))}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <LucideLink
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </LucideLink>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
}

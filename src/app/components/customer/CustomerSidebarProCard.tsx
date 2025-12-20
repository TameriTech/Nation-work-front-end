import { Button } from "@/app/components/ui/button";

export function SidebarProCard() {
  return (
    <div className="rounded-xl text-white bg-gray-900 p-4">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-[10px] font-bold text-primary-foreground">
          <img src="/icons/logo.png" alt="Logo" className="h-6" />
        </div>
        <span className="font-semibold text-sidebar-card-foreground">Pro</span>
      </div>
      <p className="mb-3 text-sm text-sidebar-card-foreground/80">
        Essayer Nation Work Premium – 1 mois offert
      </p>
      <Button
        variant={"outline"}
        size="sm"
        className="w-full border-sidebar-card-foreground/20 bg-sidebar-card-foreground text-sidebar-card hover:bg-sidebar-card-foreground/90"
      >
        Activer maintenant
      </Button>
    </div>
  );
}

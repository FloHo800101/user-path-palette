import { LayoutDashboard, Users, Inbox, Settings, Upload, FileText, CreditCard, FolderOpen } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { UserSwitch } from "@/components/UserSwitch";
import { useRole } from "@/contexts/RoleContext";

const taxClerkNavigation = [
  { title: "Mandanten", url: "/", icon: Users },
  { title: "Posteingang", url: "/inbox", icon: Inbox },
  { title: "Dashboards", url: "/dashboards", icon: LayoutDashboard },
  { title: "Einstellungen", url: "/settings", icon: Settings },
];

const clientNavigation = [
  { title: "Dashboard", url: "/mandant/dashboard", icon: LayoutDashboard },
  { title: "Beleg-Upload", url: "/mandant/upload", icon: Upload },
  { title: "Konto-Vorgänge", url: "/mandant/konto-vorgaenge", icon: CreditCard },
  { title: "Belege", url: "/mandant/receipts", icon: FileText },
  { title: "Abos & Verträge", url: "/mandant/subscriptions", icon: FolderOpen },
];

export function AppSidebar() {
  const { currentUser } = useRole();
  const navigationItems = currentUser.role === 'tax-clerk' ? taxClerkNavigation : clientNavigation;

  return (
    <Sidebar className="border-r border-sidebar-border">
      <div className="p-6">
        <h1 className="text-lg font-semibold text-sidebar-foreground">
          Belegzuordnung Assistent
        </h1>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 px-4 py-2.5 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-smooth"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="border-t border-sidebar-border">
          <UserSwitch />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

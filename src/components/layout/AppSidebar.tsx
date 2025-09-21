"use client";

import {
  LayoutDashboard,
  Smartphone,
  Send,
  Thermometer,
  CheckCircle,
  MessageSquare,
  Settings,
  BarChart3,
  MessageCircle,
  BookOpen,
  Bot,
  Eye,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Preview Dashboard", url: "/preview", icon: Eye },
  { title: "AI Assistant", url: "/dashboard/ai-assistant", icon: Bot },
  { title: "Client Management", url: "/dashboard/client", icon: Smartphone },
  { title: "WhatsApp Blast", url: "/dashboard/whatsapp-blast", icon: Send },
  {
    title: "WhatsApp Warmer",
    url: "/dashboard/whatsapp-warmer",
    icon: Thermometer,
  },
  { title: "Number Check", url: "/dashboard/number-check", icon: CheckCircle },
  {
    title: "Conversations",
    url: "/dashboard/conversation",
    icon: MessageSquare,
  },
  {
    title: "Templates",
    url: "/dashboard/data/message-templates",
    icon: MessageCircle,
  },
  { title: "Buku Alamat", url: "/dashboard/address-book", icon: BookOpen },
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
];

const settingsItems = [
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/dashboard") return currentPath === path;
    return currentPath.startsWith(path);
  };

  const getNavClass = (path: string) => {
    return isActive(path)
      ? "bg-primary text-primary-foreground font-medium"
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground";
  };

  return (
    <Sidebar
      className={state === "collapsed" ? "w-16" : "w-64"}
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar border-sidebar-border">
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          {state === "expanded" ? (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center shadow-glow">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-sidebar-foreground">
                  Display Jabar
                </h2>
                <p className="text-xs text-sidebar-muted-foreground">
                  WhatsApp Manager
                </p>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center mx-auto shadow-glow">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={state === "collapsed" ? "sr-only" : ""}>
            Menu Utama
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={`${getNavClass(
                        item.url
                      )} flex items-center gap-3 px-3 py-2 rounded-md transition-colors`}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {state === "expanded" && (
                        <span className="flex-1">{item.title}</span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupLabel className={state === "collapsed" ? "sr-only" : ""}>
            Pengaturan
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={`${getNavClass(
                        item.url
                      )} flex items-center gap-3 px-3 py-2 rounded-md transition-colors`}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {state === "expanded" && (
                        <span className="flex-1">{item.title}</span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

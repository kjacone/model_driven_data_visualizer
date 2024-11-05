"use client"
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import { useRouter } from "next/navigation";
import { chinookData } from "@/lib/chinookData";
import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";


export function AppSidebar() {

  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const tables = Object.keys(chinookData) as (keyof typeof chinookData)[];

  if (!isMounted) return null;

  const handleMenuButtonClick = () => {
    setIsSidebarOpen(false);
  };

  return (
    <Sidebar collapsible="none" variant="inset" open={isSidebarOpen}>
      <SidebarHeader >
        <Link href="/" className="text-lg font-semibold">Upeo Tech</Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>

          <SidebarGroupContent>
            <SidebarMenu>
              {tables.map((item) => (
                <SidebarMenuItem key={item} className="mb-2">
                  <Link href={`/dashboard/${item}`} onClick={handleMenuButtonClick}>
                    <div className="flex items-center">
                      <Inbox className="mr-2" />
                      <span>{item.charAt(0).toUpperCase() + item.slice(1)}</span>
                    </div>
                  </Link>
                </SidebarMenuItem>
              ))}

              <SidebarGroupLabel>Other Services</SidebarGroupLabel>
              <SidebarMenuItem className="mb-2">
                <Link href="#" onClick={handleMenuButtonClick}>
                  <div className="flex items-center">
                    <Settings className="mr-2" />
                    <span>Agent History</span>
                  </div>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem className="mb-2">
                <Link href="/" onClick={handleMenuButtonClick}>
                  <div className="flex items-center">
                    <Settings className="mr-2" />
                    <span>Settings</span>
                  </div>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

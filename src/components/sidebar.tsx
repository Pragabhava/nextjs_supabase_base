"use client"

import * as React from "react"
import Link from "next/link"
import * as Icons from "lucide-react"
import { LucideIcon } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    // SidebarSeparator,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { getSitemap } from "@/app/actions/sidebar"
import { useEffect, useState } from "react"
import { SitemapItem } from "@/app/actions/sidebar"

export function AppSidebar() {
    const [homeNav, setHomeNav] = useState<SitemapItem[]>([])
    const [adminNav, setAdminNav] = useState<SitemapItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadSitemap = async () => {
            try {
                setLoading(true)

                // Get home navigation items
                const homeResult = await getSitemap('Root.Home')
                if (homeResult.error) throw new Error(homeResult.error.message)
                console.log("Home items loaded:", homeResult.data)
                setHomeNav(homeResult.data || [])

                // Get admin navigation items
                const adminResult = await getSitemap('Root.Administracion')
                if (adminResult.error) throw new Error(adminResult.error.message)
                console.log("Admin items loaded:", adminResult.data)
                setAdminNav(adminResult.data || [])

                setError(null)
            } catch (err) {
                console.error("Error loading sitemap:", err)
                setError(err instanceof Error ? err.message : "Unknown error")
            } finally {
                setLoading(false)
            }
        }
        loadSitemap()
    }, [])

    return (
        <SidebarProvider
            defaultOpen={true}
            style={{ "--nav-height": "48px", "--sidebar-width": "256px", } as React.CSSProperties}
            className="w-auto shrink-0">
            <Sidebar className="top-[var(--nav-height)] h-[calc(100vh-var(--nav-height))]" collapsible="icon">
                <SidebarHeader className="flex flex-row items-center gap-2 py-3 px-2">
                    <SidebarTrigger className="h-6 w-6 flex-shrink-0" />
                    <span className="font-medium truncate">Dashboard</span>
                </SidebarHeader>
                <SidebarContent className="overflow-x-hidden">
                    <SidebarMenu>
                        <SidebarGroup>
                            <SidebarMenuItem key="1">
                                <SidebarMenuButton
                                    asChild
                                    tooltip="Home"
                                >
                                    <Link href="/protected/">
                                        <Icons.Home className="h-4 w-4 min-w-4" />
                                        <span>Home</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            {homeNav.map((item) => {
                                try {
                                    const iconName = item.icono || 'Home'
                                    const IconComponent = (Icons[iconName as keyof typeof Icons] as LucideIcon) || Icons.Home
                                    return (
                                        <SidebarMenuItem key={item.id}>
                                            <SidebarMenuButton
                                                asChild
                                                tooltip={item.nombre}
                                            >
                                                <Link href={`/protected/${item.slug}`}>
                                                    <IconComponent className="h-4 w-4 min-w-4" />
                                                    <span>{item.nombre}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )
                                } catch (err) {
                                    console.error("Error rendering item:", item, err)
                                    return null
                                }
                            })}
                        </SidebarGroup>
                    </SidebarMenu>
                </SidebarContent>

                {/* <SidebarSeparator /> */}

                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarGroup>
                            {adminNav.map((item) => {
                                try {
                                    const iconName = item.icono || 'Settings'
                                    const IconComponent = (Icons[iconName as keyof typeof Icons] as LucideIcon) || Icons.Settings
                                    return (
                                        <SidebarMenuItem key={item.id}>
                                            <SidebarMenuButton
                                                asChild
                                                tooltip={item.nombre}
                                            >
                                                <Link href={`/protected/${item.slug}`}>
                                                    <IconComponent className="h-4 w-4 min-w-4" />
                                                    <span>{item.nombre}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )
                                } catch (err) {
                                    console.error("Error rendering item:", item, err)
                                    return null
                                }
                            })}
                        </SidebarGroup>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
        </SidebarProvider>
    )
} 
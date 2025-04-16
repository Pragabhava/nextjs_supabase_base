"use client"

import * as React from "react"
import Link from "next/link"
import {
    Home,
    Database,
    Table2,
    FileText,
    Settings,
    List,
    Blocks,
    Lightbulb,
    PanelLeftDashed
} from "lucide-react"

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
    SidebarSeparator,
    SidebarTrigger,
} from "@/components/ui/sidebar"

export function AppSidebar() {
    return (
        <SidebarProvider
            defaultOpen={true}
            style={{ "--nav-height": "48px", "--sidebar-width": "256px", } as React.CSSProperties}
            className="w-auto shrink-0">
            <Sidebar className="top-[var(--nav-height)] h-[calc(100vh-var(--nav-height))]" collapsible="icon">
                <SidebarHeader className="flex flex-row items-center gap-2 py-3 px-2">
                    {/* The key is to use the correct markup here */}
                    <SidebarTrigger className="h-6 w-6 flex-shrink-0" />
                    <span className="font-medium truncate">Dashboard</span>
                </SidebarHeader>
                <SidebarContent className="overflow-x-hidden">
                    <SidebarMenu>
                        <SidebarGroup>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    tooltip="Project Overview"
                                >
                                    <Link href="/dashboard">
                                        <Home className="size-5" />
                                        <span>Project Overview</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    tooltip="Table Editor"
                                >
                                    <Link href="/dashboard/editor">
                                        <Table2 className="size-5" />
                                        <span>Table Editor</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    tooltip="SQL Editor"
                                >
                                    <Link href="/dashboard/sql">
                                        <FileText className="size-5" />
                                        <span>SQL Editor</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarGroup>

                        <SidebarSeparator />

                        <SidebarGroup>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    tooltip="Database"
                                    isActive={true}
                                >
                                    <Link href="/dashboard/database">
                                        <Database className="size-5" />
                                        <span>Database</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    tooltip="Authentication"
                                >
                                    <Link href="/dashboard/auth">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-auth">
                                            <path d="M5.24121 15.0674H12.7412M5.24121 15.0674V18.0674H12.7412V15.0674M5.24121 15.0674V12.0674H12.7412V15.0674M15 7.60547V4.60547C15 2.94861 13.6569 1.60547 12 1.60547C10.3431 1.60547 9 2.94861 9 4.60547V7.60547M5.20898 9.60547L5.20898 19.1055C5.20898 20.21 6.10441 21.1055 7.20898 21.1055H16.709C17.8136 21.1055 18.709 20.21 18.709 19.1055V9.60547C18.709 8.5009 17.8136 7.60547 16.709 7.60547L7.20899 7.60547C6.10442 7.60547 5.20898 8.5009 5.20898 9.60547Z" />
                                        </svg>
                                        <span>Authentication</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarGroup>

                        <SidebarSeparator />

                        <SidebarGroup>
                            <div className="relative">
                                <div className="absolute pointer-events-none flex h-2 w-2 left-[18px] group-data-[state=expanded]:left-[20px] top-2 z-10 rounded-full bg-warning-600" />
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip="Advisors"
                                    >
                                        <Link href="/dashboard/advisors">
                                            <Lightbulb className="size-5" />
                                            <span>Advisors</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </div>

                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    tooltip="Reports"
                                >
                                    <Link href="/dashboard/reports">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-reports">
                                            <path d="M3.03479 9.0849L8.07241 4.0575C8.46296 3.66774 9.0954 3.66796 9.48568 4.05799L14.0295 8.59881C14.42 8.98912 15.053 8.98901 15.4435 8.59857L20.5877 3.45418M16.4996 3.01526H19.9996C20.5519 3.01526 20.9996 3.46297 20.9996 4.01526V7.51526M2.99963 12.0153L2.99963 20.1958C2.99963 20.7481 3.44735 21.1958 3.99963 21.1958L20.0004 21.1958C20.5527 21.1958 21.0004 20.7481 21.0004 20.1958V9.88574M8.82532 9.87183L8.82531 21.1958M15.1754 15.0746V21.1949" />
                                        </svg>
                                        <span>Reports</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    tooltip="Logs"
                                >
                                    <Link href="/dashboard/logs">
                                        <List className="size-5" />
                                        <span>Logs</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    tooltip="API Docs"
                                >
                                    <Link href="/dashboard/api">
                                        <FileText className="size-5" />
                                        <span>API Docs</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    tooltip="Integrations"
                                >
                                    <Link href="/dashboard/integrations">
                                        <Blocks className="size-5" />
                                        <span>Integrations</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarGroup>

                        <SidebarGroup>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    tooltip="Project Settings"
                                >
                                    <Link href="/dashboard/settings">
                                        <Settings className="size-5" />
                                        <span>Project Settings</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarGroup>
                    </SidebarMenu>
                </SidebarContent>

                <SidebarFooter>
                    <SidebarGroup>
                        <button
                            type="button"
                            className="relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border text-foreground hover:bg-surface-300 shadow-none focus-visible:outline-border-strong data-[state=open]:bg-surface-300 data-[state=open]:outline-border-strong border-transparent text-xs py-1 h-[26px] w-min px-1.5 mx-0.5 group-data-[state=expanded]:px-2"
                        >
                            <div className="[&_svg]:h-[14px] [&_svg]:w-[14px] text-foreground-lighter">
                                <PanelLeftDashed />
                            </div>
                        </button>
                    </SidebarGroup>
                </SidebarFooter>
            </Sidebar>
        </SidebarProvider>
    )
} 
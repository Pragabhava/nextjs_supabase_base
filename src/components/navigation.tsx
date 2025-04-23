"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, Search, ChevronsUpDown, CircleHelp, Inbox, User as UserIcon, Settings, Command, FlaskConical, LogOut } from "lucide-react"
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
} from "@/components/ui/navigation-menu"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { getProjectSelector, ProjectSelector } from "@/app/actions/navigation"
import { useEffect, useState } from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function Navigation({ user }: { user: User }) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [projectSelector, setProjectSelector] = useState<ProjectSelector[]>([])
    const [selectedProject, setSelectedProject] = useState<string>("")
    const { theme, setTheme } = useTheme()
    const router = useRouter()

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/auth/login')
    };

    useEffect(() => {
        const loadProjectSelector = async () => {
            try {
                setLoading(true)

                const projectResult = await getProjectSelector()
                if (projectResult.error) throw new Error(projectResult.error.message)
                console.log("Project selector loaded:", projectResult.data)
                setProjectSelector(projectResult.data || [])

                // Set the first project as selected by default if there are projects
                if (projectResult.data && projectResult.data.length > 0) {
                    setSelectedProject(projectResult.data[0].id.toString())
                }

                setError(null)
            } catch (error) {
                console.error("Error loading project selector:", error)
                setError(error instanceof Error ? error.message : "Unknown error")
            } finally {
                setLoading(false)
            }
        }
        loadProjectSelector()
    }, [])

    const handleProjectChange = (projectId: string) => {
        setSelectedProject(projectId)
        // Here you can add navigation logic if needed when switching projects
        // For example: router.push(`/project/${projectId}`)
    }

    return (
        <div className="flex-shrink-0">
            {/* Mobile Navigation Bar */}
            <div className="flex flex-row md:hidden h-14 w-full">
                <nav className="group px-4 z-10 w-full h-14 border-b bg-dash-sidebar border-default shadow-xl transition-width duration-200 hide-scrollbar flex flex-row items-center justify-between overflow-x-auto">
                    <Link href="/dashboard" className="flex items-center h-[26px] w-[26px] min-w-[26px]">
                        <img alt="Logo" src="/logo.svg" className="absolute h-[26px] w-[26px] cursor-pointer rounded" />
                    </Link>
                    <div className="flex gap-2">
                        <button className="whitespace-nowrap border border-input text-sm font-medium hover:bg-accent ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group flex-grow h-[30px] rounded-md p-2 flex items-center justify-between bg-transparent border-none text-foreground-lighter hover:bg-opacity-100 hover:border-strong hover:text-foreground-light focus-visible:!outline-4 focus-visible:outline-offset-1 focus-visible:outline-brand-600 transition">
                            <div className="flex items-center space-x-2">
                                <Search className="h-[18px] w-[18px]" />
                            </div>
                        </button>
                        <button className="relative justify-center cursor-pointer items-center space-x-2 text-center font-regular ease-out duration-200 outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border dark:bg-muted hover:bg-selection hover:border-stronger focus-visible:outline-brand-600 data-[state=open]:outline-brand-600 data-[state=open]:border-button-hover flex lg:hidden border-default bg-surface-100/75 text-foreground-light rounded-md min-w-[30px] w-[30px] h-[30px] data-[state=open]:bg-overlay-hover/30">
                            <Menu className="h-[18px] w-[18px]" />
                        </button>
                    </div>
                </nav>
            </div>

            {/* Desktop Header */}
            <header className="flex h-12 items-center flex-shrink-0 border-b">
                <div className="flex items-center justify-between h-full pr-3 flex-1 overflow-x-auto gap-x-4 md:pl-4">
                    <div className="flex items-center text-sm">
                        <Link href="/protected" className="items-center justify-center flex-shrink-0 hidden md:flex">
                            <img alt="SP" src="/logo.svg" className="w-[18px] h-[18px]" />
                        </Link>

                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <button className="relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border text-foreground hover:bg-surface-300 shadow-none focus-visible:outline-border-strong data-[state=open]:bg-surface-300 data-[state=open]:outline-border-strong border-transparent text-xs px-2.5 py-1 h-[26px] pr-2">
                                        <span className="truncate">
                                            <div className="flex items-center space-x-2">
                                                <p className="text-xs">Sexto Piso</p>
                                            </div>
                                        </span>
                                    </button>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    {!loading && projectSelector.length > 0 ? (
                                        <Select value={selectedProject} onValueChange={handleProjectChange}>
                                            <SelectTrigger className="relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border text-foreground hover:bg-surface-300 shadow-none focus-visible:outline-border-strong data-[state=open]:bg-surface-300 data-[state=open]:outline-border-strong border-transparent text-xs px-2.5 py-1 h-[26px] pr-2">
                                                <SelectValue placeholder="Select project" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {projectSelector.map((project) => (
                                                    <SelectItem key={project.id} value={project.id.toString()}>
                                                        {project.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <button className="relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border text-foreground hover:bg-surface-300 shadow-none focus-visible:outline-border-strong data-[state=open]:bg-surface-300 data-[state=open]:outline-border-strong border-transparent text-xs px-2.5 py-1 h-[26px] pr-2">
                                            <span className="truncate">
                                                <div className="flex items-center space-x-2">
                                                    <p className="text-sm">{loading ? "Loading projects..." : "No projects available"}</p>
                                                </div>
                                            </span>
                                            <ChevronsUpDown className="h-[14px] w-[14px] text-foreground-lighter" />
                                        </button>
                                    )}
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    {/* Right side buttons */}
                    <div className="flex items-center gap-x-2">
                        <button className="relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border text-foreground hover:bg-surface-300 shadow-none focus-visible:outline-border-strong data-[state=open]:bg-surface-300 data-[state=open]:outline-border-strong border-transparent text-xs py-1 h-[26px] px-1">
                            <Inbox className="h-[14px] w-[14px] text-foreground-lighter" />
                        </button>
                        <button className="relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border text-foreground hover:bg-surface-300 shadow-none focus-visible:outline-border-strong data-[state=open]:bg-surface-300 data-[state=open]:outline-border-strong border-transparent text-xs py-1 h-[26px] px-1">
                            <CircleHelp className="h-[14px] w-[14px] text-foreground-lighter" />
                        </button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 text-foreground bg-alternative dark:bg-muted hover:bg-selection border-strong hover:border-stronger focus-visible:outline-brand-600 data-[state=open]:bg-selection data-[state=open]:outline-brand-600 data-[state=open]:border-button-hover text-xs border flex-shrink-0 [&>span]:flex px-0 py-0 rounded-full overflow-hidden h-8 w-8">
                                    <figure className="bg-foreground flex items-center justify-center w-8 h-8 rounded-md">
                                        {user?.email ? (
                                            <span className="text-xs text-background font-medium">
                                                {user.email[0].toUpperCase()}
                                            </span>
                                        ) : (
                                            <UserIcon className="h-[18px] w-[18px] text-background" />
                                        )}
                                    </figure>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-64">
                                <div className="px-2 py-1.5 flex flex-col gap-1 text-sm">
                                    {user?.email && (
                                        <span className="w-full text-left font-medium text-foreground truncate">{user.email}</span>
                                    )}
                                    <span className="w-full text-left text-foreground-muted truncate">{user?.email || "user@example.com"}</span>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <Settings className="h-[14px] w-[14px] text-foreground-lighter" />
                                        <span>Account preferences</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <FlaskConical className="h-[14px] w-[14px] text-foreground-lighter" />
                                        <span>Feature previews</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Command className="h-[14px] w-[14px] text-foreground-lighter" />
                                        <span>Command menu</span>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel className="px-2 py-1.5 text-xs text-foreground-lighter">
                                        Theme
                                    </DropdownMenuLabel>
                                    <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                                        <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onSelect={handleLogout}>
                                        <LogOut className="h-[14px] w-[14px] text-foreground-lighter" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>
        </div>
    )
} 
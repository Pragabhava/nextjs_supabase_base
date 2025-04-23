'use server'

import { createClient } from '@/lib/supabase/server'

export type SitemapItem = {
    id: number
    nombre: string
    slug: string
    visible: boolean
    order: number
    nodo: string
    icono: string
}

export async function getSitemap(parentPath: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('sitemap')
        .select('id, nombre, slug, visible, order, nodo, icono')
        .eq('visible', true)
        .filter('nodo', 'match', `${parentPath}.*{1}`)
        .neq('nodo', parentPath)
        .order('order')

    return { data: data as SitemapItem[], error }
}
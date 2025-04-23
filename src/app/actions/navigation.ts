'use server'

import { createClient } from '@/lib/supabase/server'

export type ProjectSelector = {
    id: number
    nombre: string
    prefijo: string
}

export async function getProjectSelector() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('project')
        .select('id, nombre, prefijo')

    return { data: data as ProjectSelector[], error }
}

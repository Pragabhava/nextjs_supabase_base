'use server'

import { queryMssql } from '@/lib/db/mssql'

export type Distribuidora = {
    IdDistribuidora: number;
    CodigoDistribuidora: string;
    Distribuidora: string;
}

export type Editorial = {
    IdEditorial: number;
    CodigoEditorial: string;
    Editorial: string;
    IdDistribuidora: number;
    CodigoDistribuidora: string;
    Distribuidora: string;
}

export async function getDistribuidoras() {
    try {
        const result = await queryMssql<Distribuidora>(
            `
            SELECT
                  1 as IdDistribuidora
                , 'SPM' as CodigoDistribuidora
                , 'Sexto Piso México' as Distribuidora
            UNION ALL
            SELECT
                  2 as IdDistribuidora
                , 'SPD' as CodigoDistribuidora
                , 'SP Distribuciones' as Distribuidora
            `,
            [],
            'SPD'
        );
        return { data: result, error: null };
    } catch (error) {
        console.error('Error fetching distribuidoras:', error);
        return { data: [], error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export async function getEditoriales() {
    try {
        const result = await queryMssql<Editorial>(
            `
            SELECT
                  1 as IdEditorial
                , 'SPM' as CodigoEditorial
                , 'Editorial Sexto Piso' as Editorial
                , 1 as IdDistribuidora
                , 'SPM' as CodigoDistribuidora
                , 'Sexto Piso México' as Distribuidora
            UNION ALL
            SELECT
                  ed.CIDVALORCLASIFICACION as IdEditorial
                , ed.CCODIGOVALORCLASIFICACION as CodigoEditorial
                , ed.CVALORCLASIFICACION as Editorial
                , 2 as IdDistribuidora
                , 'SPD' as CodigoDistribuidora
                , 'SP Distribuciones' as Distribuidora
            FROM
                [adEMPRESA_DISTRIBUIDOR].[dbo].[admClasificaciones] dist
            INNER JOIN
                [adEMPRESA_DISTRIBUIDOR].[dbo].[admClasificacionesValores] ed
                ON
                dist.CIDCLASIFICACION = ed.CIDCLASIFICACION
            WHERE
                dist.CIDCLASIFICACION = 25
            ORDER BY
                  IdDistribuidora
                , Editorial
            `,
            [],
            'SPD'
        );
        return { data: result, error: null };
    } catch (error) {
        console.error('Error fetching editoriales:', error);
        return { data: [], error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

'use server'

import { queryMssql } from '@/lib/db/mssql'

export type Facturacion = {
    ISBN: string;
    Titulo: string;
    Autor: string;
    Editorial: string;
    PvpEfectivo: number;
    Unidades: number;
    Importe: number;
}

export async function getFacturacionTable(fechaInicio: string, fechaFin: string, editoriales?: string[]) {
    try {
        let query = `
            SELECT
                  fmu.CISBN AS ISBN
                , CAST(fmu.TITULO AS nvarchar(1000)) AS Titulo
                , fmu.AUTOR AS Autor
                , fmu.EDITORIAL AS Editorial
                , CASE 
                    WHEN SUM(fmu.UNIDADES) = 0 THEN NULL 
                    ELSE ROUND(SUM(fmu.IMPORTE) / NULLIF(SUM(fmu.UNIDADES), 0), 2) 
                  END AS PvpEfectivo
                , SUM(fmu.UNIDADES) AS Unidades
                , SUM(fmu.IMPORTE) AS Importe
            FROM
                adEMPRESA_DISTRIBUIDOR.dbo.facturacion_mensual_union fmu
            WHERE
                fmu.CFECHA BETWEEN @p0 AND @p1
                AND CESTADO = 'VIGENTE'
                AND CTIPO = 'Factura Crédito'
        `;
        const params: (string | number | boolean | Date | Buffer | null)[] = [fechaInicio, fechaFin];

        // Handle editorial filtering
        if (editoriales && editoriales.length > 0) {
            if (editoriales.length === 1) {
                // Single editorial case - use equality
                query += `\n                AND fmu.EDITORIAL = @p2`;
                params.push(editoriales[0]);
            } else {
                // Multiple editorials case - use IN clause
                const placeholders = editoriales.map((_, index) => `@p${index + 2}`).join(', ');
                query += `\n                AND fmu.EDITORIAL IN (${placeholders})`;
                editoriales.forEach(editorial => params.push(editorial));
            }
        }

        query += `\n            GROUP BY
                  fmu.CISBN
                , CAST(fmu.TITULO AS nvarchar(1000))
                , fmu.AUTOR
                , fmu.EDITORIAL
            ORDER BY
                SUM(fmu.UNIDADES) DESC`;

        const result = await queryMssql<Facturacion>(
            query,
            params,
            'SPD'
        );
        return { data: result, error: null };
    } catch (error) {
        console.error('Error fetching facturacion:', error);
        return { data: [], error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

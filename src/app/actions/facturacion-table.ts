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

export async function getFacturacionTable(fechaInicio: string, fechaFin: string, editorial?: string) {
    try {
        let query = `
            SELECT
                  fmu.CISBN AS ISBN
                , CAST(fmu.TITULO AS nvarchar(1000)) AS Titulo
                , fmu.AUTOR AS Autor
                , fmu.EDITORIAL AS Editorial
                , ROUND(SUM(fmu.IMPORTE) / SUM(fmu.UNIDADES), 2) AS PvpEfectivo
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
        if (editorial) {
            query += `\n                AND fmu.EDITORIAL = @p2`;
            params.push(editorial);
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

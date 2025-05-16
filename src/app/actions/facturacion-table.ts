'use server'

import { queryMssql } from '@/lib/db/mssql'

export type Facturacion = {
    ISBN: string;
    Titulo: string;
    Autor: string;
    Editorial: string;
    PVP: number;
    PvpEfectivo: number;
    UnidadesFacturadas: number;
    UnidadesDevueltas: number;
    UnidadesNetas: number;
    ImporteFacturado: number;
    ImporteDevuelto: number;
    ImporteNeto: number;
}

export async function getFacturacionTable(fechaInicio: string, fechaFin: string, editoriales?: string[]) {
    try {
        const spQuery = `
            SELECT
                PRO.CCODIGOPRODUCTO AS ISBN
                ,PRO.CNOMBREPRODUCTO AS Titulo
                ,PRO.CTEXTOEXTRA1 AS Autor
                ,'Editorial Sexto Piso' AS Editorial
                ,PRO.CPRECIO1 as PVP
                ,ROUND(
                    CASE
                        WHEN SUM(
                            CASE WHEN DOC.CIDDOCUMENTODE = '4' THEN MOV.CUNIDADESCAPTURADAS ELSE (-1)*MOV.CUNIDADESCAPTURADAS END
                            ) = 0 THEN 0
                        ELSE SUM(
                            CASE WHEN DOC.CIDDOCUMENTODE = '4' THEN MOV.CTOTAL ELSE (-1)*MOV.CTOTAL END
                            )/SUM(
                                CASE WHEN DOC.CIDDOCUMENTODE = '4' THEN MOV.CUNIDADESCAPTURADAS ELSE (-1)*MOV.CUNIDADESCAPTURADAS END
                                )
                        END, 2
                    ) AS PvpEfectivo
                ,SUM(
                    CASE WHEN DOC.CIDDOCUMENTODE = '4' THEN MOV.CUNIDADESCAPTURADAS ELSE 0 END
                    ) AS UnidadesFacturadas
                ,SUM(
                    CASE WHEN DOC.CIDDOCUMENTODE = '5' THEN MOV.CUNIDADESCAPTURADAS ELSE 0 END
                    ) AS UnidadesDevueltas
                ,SUM(
                    CASE WHEN DOC.CIDDOCUMENTODE = '4' THEN MOV.CUNIDADESCAPTURADAS ELSE (-1)*MOV.CUNIDADESCAPTURADAS END
                    ) AS UnidadesNetas
                ,SUM(
                    CASE WHEN DOC.CIDDOCUMENTODE = '4' THEN MOV.CTOTAL ELSE 0 END
                    ) AS ImporteFacturado
                ,SUM(
                    CASE WHEN DOC.CIDDOCUMENTODE = '5' THEN MOV.CTOTAL ELSE 0 END
                    ) AS ImporteDevuelto
                ,SUM(
                    CASE WHEN DOC.CIDDOCUMENTODE = '4' THEN MOV.CTOTAL ELSE (-1)*MOV.CTOTAL END
                    ) AS ImporteNeto
            FROM adEDITORIAL_SEXTO_PISO.dbo.admDocumentos DOC
            INNER JOIN adEDITORIAL_SEXTO_PISO.dbo.admmovimientos MOV ON DOC.CIDDOCUMENTO = MOV.CIDDOCUMENTO
            INNER JOIN adEDITORIAL_SEXTO_PISO.dbo.admProductos PRO ON MOV.CIDPRODUCTO = PRO.CIDPRODUCTO
            INNER JOIN adEDITORIAL_SEXTO_PISO.dbo.admFoliosDigitales DIG ON DOC.CIDDOCUMENTO = DIG.CIDDOCTO
            WHERE
                DOC.CIDDOCUMENTODE IN ('4', '5')
                AND DOC.CCANCELADO <> '1'
                AND DIG.CESTADO = '2'
                AND DOC.CFECHA BETWEEN @p0 AND @p1
            GROUP BY
                PRO.CCODIGOPRODUCTO
                ,PRO.CNOMBREPRODUCTO
                ,PRO.CTEXTOEXTRA1
                ,PRO.CPRECIO1
        `
        const distQuery = `
            SELECT
                PRO.CCODIGOPRODUCTO AS ISBN
                ,PRO.CNOMBREPRODUCTO AS Titulo
                ,PRO.CTEXTOEXTRA1 AS Autor
                ,CLA.CVALORCLASIFICACION AS Editorial
                ,PRO.CPRECIO1 as PVP
                ,ROUND(
                    CASE
                        WHEN SUM(
                            CASE WHEN DOC.CIDDOCUMENTODE = '4' THEN MOV.CUNIDADESCAPTURADAS ELSE (-1)*MOV.CUNIDADESCAPTURADAS END
                            ) = 0 THEN 0
                        ELSE SUM(
                            CASE WHEN DOC.CIDDOCUMENTODE = '4' THEN MOV.CTOTAL ELSE (-1)*MOV.CTOTAL END
                            )/SUM(
                                CASE WHEN DOC.CIDDOCUMENTODE = '4' THEN MOV.CUNIDADESCAPTURADAS ELSE (-1)*MOV.CUNIDADESCAPTURADAS END
                                )
                        END, 2
                    ) AS PvpEfectivo
                ,SUM(
                    CASE WHEN DOC.CIDDOCUMENTODE = '4' THEN MOV.CUNIDADESCAPTURADAS ELSE 0 END
                    ) AS UnidadesFacturadas
                ,SUM(
                    CASE WHEN DOC.CIDDOCUMENTODE = '5' THEN MOV.CUNIDADESCAPTURADAS ELSE 0 END
                    ) AS UnidadesDevueltas
                ,SUM(
                    CASE WHEN DOC.CIDDOCUMENTODE = '4' THEN MOV.CUNIDADESCAPTURADAS ELSE (-1)*MOV.CUNIDADESCAPTURADAS END
                    ) AS UnidadesNetas
                ,SUM(
                    CASE WHEN DOC.CIDDOCUMENTODE = '4' THEN MOV.CTOTAL ELSE 0 END
                    ) AS ImporteFacturado
                ,SUM(
                    CASE WHEN DOC.CIDDOCUMENTODE = '5' THEN MOV.CTOTAL ELSE 0 END
                    ) AS ImporteDevuelto
                ,SUM(
                    CASE WHEN DOC.CIDDOCUMENTODE = '4' THEN MOV.CTOTAL ELSE (-1)*MOV.CTOTAL END
                    ) AS ImporteNeto
            FROM adEMPRESA_DISTRIBUIDOR.dbo.admDocumentos DOC
            INNER JOIN adEMPRESA_DISTRIBUIDOR.dbo.admmovimientos MOV ON DOC.CIDDOCUMENTO = MOV.CIDDOCUMENTO
            INNER JOIN adEMPRESA_DISTRIBUIDOR.dbo.admProductos PRO ON MOV.CIDPRODUCTO = PRO.CIDPRODUCTO
            INNER JOIN adEMPRESA_DISTRIBUIDOR.dbo.admFoliosDigitales DIG ON DOC.CIDDOCUMENTO = DIG.CIDDOCTO
            LEFT OUTER JOIN adEMPRESA_DISTRIBUIDOR.dbo.admClasificacionesValores AS CLA ON PRO.CIDVALORCLASIFICACION1 = CLA.CIDVALORCLASIFICACION
            WHERE
                DOC.CIDDOCUMENTODE IN ('4', '5')
                AND DOC.CCANCELADO <> '1'
                AND DIG.CESTADO = '2'
                AND DOC.CFECHA BETWEEN @p0 AND @p1
        `
        const params: (string | number | boolean | Date | Buffer | null)[] = [fechaInicio, fechaFin];

        let query = '';
        if (editoriales && editoriales.includes('Editorial Sexto Piso')) {
            if (editoriales.length === 1) {
                // Only Editorial Sexto Piso
                query = spQuery;
            } else {
                // Editorial Sexto Piso and others
                query = spQuery + " UNION ALL " + distQuery;
                if (editoriales.length === 1) {
                    // Single editorial case - use equality
                    query += ` AND PRO.CTEXTOEXTRA2 = @p2`;
                    params.push(editoriales[0]);
                } else {
                    // Multiple editorials case - use IN clause
                    const placeholders = editoriales.map((_, index) => `@p${index + 2}`).join(', ');
                    query += ` AND PRO.CTEXTOEXTRA2 IN (${placeholders})`;
                    editoriales.forEach(editorial => params.push(editorial));
                }
                query += " GROUP BY PRO.CCODIGOPRODUCTO, PRO.CNOMBREPRODUCTO, PRO.CTEXTOEXTRA1, CLA.CVALORCLASIFICACION, PRO.CPRECIO1";
            }
        } else if (editoriales && editoriales.length > 0) {
            // Doesn't include Editorial Sexto Piso
            query = distQuery;
            if (editoriales.length === 1) {
                // Single editorial case - use equality
                query += ` AND CLA.CVALORCLASIFICACION = @p2`;
                params.push(editoriales[0]);
            } else {
                // Multiple editorials case - use IN clause
                const placeholders = editoriales.map((_, index) => `@p${index + 2}`).join(', ');
                query += ` AND CLA.CVALORCLASIFICACION IN (${placeholders})`;
                editoriales.forEach(editorial => params.push(editorial));
            }
            query += " GROUP BY PRO.CCODIGOPRODUCTO, PRO.CNOMBREPRODUCTO, PRO.CTEXTOEXTRA1, CLA.CVALORCLASIFICACION, PRO.CPRECIO1";
        } else {
            // No editorial filters
            query = spQuery + " UNION ALL " + distQuery;
            query += " GROUP BY PRO.CCODIGOPRODUCTO, PRO.CNOMBREPRODUCTO, PRO.CTEXTOEXTRA1, CLA.CVALORCLASIFICACION, PRO.CPRECIO1";
        }

        query = `SELECT * FROM (${query}) AS fmu ORDER BY fmu.UnidadesFacturadas DESC`;

        const result = await queryMssql<Facturacion>(
            query,
            params,
            'SPD',
            // 60000
        );
        return { data: result, error: null };
    } catch (error) {
        console.error('Error fetching facturacion:', error);
        return { data: [], error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

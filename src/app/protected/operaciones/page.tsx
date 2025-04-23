import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function OperacionesPage() {
    return (
        <div className="flex flex-col gap-4 p-4 md:p-6">
            <h1 className="text-2xl font-bold tracking-tight">Operaciones</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Órdenes Pendientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">24</p>
                        <p className="text-sm text-muted-foreground">Últimas 24 horas</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>En Proceso</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">12</p>
                        <p className="text-sm text-muted-foreground">Operaciones activas</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Completadas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">156</p>
                        <p className="text-sm text-muted-foreground">Este mes</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Operaciones Recientes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between border-b pb-4">
                                <div>
                                    <p className="font-medium">Operación #{2024001 + i}</p>
                                    <p className="text-sm text-muted-foreground">Cliente: Empresa {i}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">$ {(1000 * i).toLocaleString()}</p>
                                    <p className="text-sm text-muted-foreground">Hace {i} hora{i > 1 ? 's' : ''}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 
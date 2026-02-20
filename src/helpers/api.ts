import type { APIContext } from 'astro'

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

type RouteHandler<T = any> = (data: T, context: APIContext) => Response | Promise<Response>

type RouteHandlers = {
    [K in HTTPMethod]?: RouteHandler
}

/**
 * Crea un manejador de rutas API reutilizable con soporte para múltiples métodos HTTP.
 * @param handlers - Objeto con handlers para cada método HTTP
 * @returns Función handler para usar en endpoints de Astro
 * @example
 * export const { GET, POST } = createAPIHandler({
 *   GET: (params) => new Response(JSON.stringify(params)),
 *   POST: (body) => new Response(JSON.stringify(body))
 * })
 */
export function createAPIHandler(handlers: RouteHandlers) {
    const handler = async (context: APIContext) => {
        const { request } = context
        const method = request.method as HTTPMethod

        const routeHandler = handlers[method]

        if (!routeHandler) {
            return new Response(
                JSON.stringify({ error: 'Method not allowed' }),
                { status: 405, headers: { 'Content-Type': 'application/json' } }
            )
        }

        try {
            let data: any

            if (method === 'GET') {
                // Parse query params
                data = Object.fromEntries(new URL(request.url).searchParams.entries())
            } else if (['POST', 'PUT', 'PATCH'].includes(method)) {
                // Validar Content-Type
                const contentType = request.headers.get('Content-Type')
                if (!contentType?.includes('application/json')) {
                    return new Response(
                        JSON.stringify({ error: 'Content-Type must be application/json' }),
                        { status: 400, headers: { 'Content-Type': 'application/json' } }
                    )
                }

                // Parse JSON body
                try {
                    data = await request.json()
                } catch (error) {
                    return new Response(
                        JSON.stringify({ error: 'Invalid JSON body' }),
                        { status: 400, headers: { 'Content-Type': 'application/json' } }
                    )
                }
            }

            return await routeHandler(data, context)
        } catch (error) {
            console.error(`[API Error] ${method}:`, error)
            return new Response(
                JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            )
        }
    }

    // Retornar objeto con métodos como propiedades
    const methods: Record<string, typeof handler> = {}
    Object.keys(handlers).forEach(method => {
        methods[method] = handler
    })

    return methods as Record<HTTPMethod, typeof handler>
}

/**
 * Helper para crear respuestas JSON con headers automáticos.
 * @param data - Datos a serializar
 * @param status - Código de estado HTTP (default: 200)
 * @returns Response con JSON y headers apropiados
 * @example
 * return jsonResponse({ success: true, data: result })
 * return jsonResponse({ error: 'Not found' }, 404)
 */
export function jsonResponse(data: any, status: number = 200): Response {
    return new Response(
        JSON.stringify(data, null, 2),
        {
            status,
            headers: { 'Content-Type': 'application/json' }
        }
    )
}
export function newRes(value: any, init?: ResponseInit) {
    return new Response(JSON.stringify(value, null, 2), {
        ...init
    })
}

// https://github.com/web3-storage/web3.storage/blob/main/packages/api/src/cors.js

import { IRequest, RouteHandler } from "itty-router"

export const corsOptions = (request: Request): Response => {
	const headers = request.headers
	// Make sure the necessary headers are present for this to be a valid pre-flight request
	if (
		headers.get('Origin') !== null &&
		headers.get('Access-Control-Request-Method') !== null &&
		headers.get('Access-Control-Request-Headers') !== null
	) {
		// Handle CORS pre-flight request.
		const respHeaders: Record<string, string> = {
			'Content-Length': '0',
			'Access-Control-Allow-Origin': headers.get('origin') || '*',
			'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
			'Access-Control-Max-Age': '86400',
			// Allow all future content Request headers to go back to browser
			// such as Authorization (Bearer) or X-Client-Name-Version
			'Access-Control-Allow-Headers':
				headers.get('Access-Control-Request-Headers') || '',
			'Access-Control-Expose-Headers': 'Link, Count, Page, Size'
		}

		return new Response(null, {
			status: 204,
			headers: respHeaders
		})
	} else {
		return new Response('Non CORS options request not allowed', {
			status: 405,
			statusText: 'Method Not Allowed'
		})
	}
}

export const withCorsHeaders = (handler: RouteHandler): RouteHandler => {
	return async (request: IRequest, ...rest): Promise<Response> => {
		const response = await handler(request, ...rest)
		return addCorsHeaders(request, response)
	}
}

export const addCorsHeaders = (request: Request, response: Response): Response => {
	// Clone the response so that it's no longer immutable (like if it comes from cache or fetch)
	response = new Response(response.body, response)
	const origin = request.headers.get('origin')
	if (origin) {
		response.headers.set('Access-Control-Allow-Origin', origin)
		response.headers.set('Vary', 'Origin')
	} else {
		response.headers.set('Access-Control-Allow-Origin', '*')
	}
	response.headers.set('Access-Control-Expose-Headers', 'Link, Count, Page, Size')
	return response
}

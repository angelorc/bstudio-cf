import { Router } from 'itty-router'
import { corsOptions } from './cors'
import { Env } from './types'
import { upload } from './upload'

const router = Router()

router.options('*', corsOptions)
router.get('healtz', () => new Response(JSON.stringify({ ok: true }), { status: 200 }))
router.post('upload', upload)

export default {
	async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
		let response
		try {
			env = { ...env } // new env object for every request (it is shared otherwise)!
			response = await router.handle(request, env, ctx)
		} catch (error) {
			// @ts-ignore
			response = serverError(error, request, env)
		}
		return response
	}
}

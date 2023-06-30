import { Env } from "./types";
import { IPFSStorageProvider } from '@bitsongjs/storage'

export const upload = async (request: Request, env: Env): Promise<Response> => {
	const { headers } = request
	const contentType = headers.get('content-type') || ''

	if (contentType.startsWith('multipart/form-data')) {
		const formData = await request.formData()
		console.log(Array.from(formData.entries()))

		const formDataFiles = formData.getAll('file') as unknown
		const files: File[] = formDataFiles as File[]

		console.log(new Map(files.length))

		//const ipfs = new IPFSStorageProvider('https://bas-cdn.com', '')
		//const cid = await ipfs.uploadAll(files)

		return new Response(JSON.stringify({ ok: true }), { status: 200 })
	}

	return new Response(JSON.stringify({ ok: false }), { status: 500 })
}

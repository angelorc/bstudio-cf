import { unstable_dev } from 'wrangler';
import type { UnstableDevWorker } from 'wrangler';
import { describe, expect, it, beforeAll, afterAll } from 'vitest';

describe('Worker', () => {
	let worker: UnstableDevWorker;

	beforeAll(async () => {
		worker = await unstable_dev('src/index.ts', { experimental: { disableExperimentalWarning: true } });
	});

	afterAll(async () => {
		await worker.stop();
	});

	it('(healtz) should return 200 response', async () => {
		const resp = await worker.fetch('/healtz');
		expect(resp.status).toBe(200);

		const json = await resp.json();
		expect(json).toEqual({ ok: true });
	});
});

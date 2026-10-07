import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { RequestHandler } from './$types';

async function loadResume(): Promise<Buffer> {
	const candidates = [
		join(process.cwd(), 'static', 'resume.pdf'),
		join(process.cwd(), 'build', 'client', 'resume.pdf'),
		join(process.cwd(), 'client', 'resume.pdf')
	];

	for (const path of candidates) {
		try {
			return await readFile(path);
		} catch {
			// try next location
		}
	}

	throw new Error('resume.pdf not found');
}

export const GET: RequestHandler = async () => {
	const pdf = await loadResume();

	return new Response(pdf, {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': 'inline; filename="Mann_Lohchab_Resume.pdf"',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};

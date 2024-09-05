#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

const seedData = [
	{
		companyName: 'Alfreds Futterkiste',
		contactName: 'Maria Anders',
	},
	{
		companyName: 'Around the Horn',
		contactName: 'Thomas Hardy',
	},
];

const run = async () => {
	const target = process.argv.slice(2)[0];
	if (!target.match(/^--local$|^--remote$/)) {
		console.error('require target --local or --remote');
		process.exit(1);
	}

	try {
		const { stderr } = await execPromise(
			`pnpm wrangler d1 execute d1-worker-toy --command="DELETE FROM Customers" ${target}`
		);

		if (stderr) {
			console.error('Command Error:\n', stderr);
			process.exit(1);
		}

		await Promise.all(
			seedData.map(async (seed) => {
				await execPromise(
					`pnpm wrangler d1 execute d1-worker-toy --command="INSERT INTO Customers (CompanyName, ContactName) VALUES ('${seed.companyName}', '${seed.contactName}');" ${target}`
				);
			})
		);

		console.log('seed completed !!!');
	} catch (error) {
		console.error(error);
	}
};

run();

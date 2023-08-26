import { upsertParams } from '../constants';

export const generalizedUpsert = async (params: upsertParams) => {
	const { modelName, uniqueId, kvpArray, prisma } = params;


	const d : any = { where: {
		id: Number(uniqueId) },
	update: {
	},
	create: {
		id: Number(uniqueId),
	},
	};

	for (const kvp of kvpArray) {
		d.create[kvp.k] = kvp.v;
		d.update[kvp.k] = kvp.v;
	}
	// console.log('Model name (upsert): ' + modelName);
	// console.log(JSON.stringify(d, null, '\t'));

	const ret = prisma[modelName].upsert(d);

	return ret;
};
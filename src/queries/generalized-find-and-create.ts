import { upsertParams } from '../constants';

export const generalizedFindAndCreate = async (params: upsertParams) => {
	const { modelName, uniqueId, kvpArray, prisma } = params;


	const d : any = { where: {
		id: Number(uniqueId) },
	// Leave update empty on purpose. This is only to find and create.
	update: {
	},
	create: {
		id: Number(uniqueId),
	},
	};

	for (const kvp of kvpArray) {
		d.create[kvp.k] = kvp.v;
		if (kvp.v.connect) {
			d.update[kvp.k] = kvp.v;
		}
	}
	// console.log('Model name (find and create): ' + modelName);
	// console.log(JSON.stringify(d, null, '\t'));

	const ret = prisma[modelName].upsert(d);

	return ret;
};
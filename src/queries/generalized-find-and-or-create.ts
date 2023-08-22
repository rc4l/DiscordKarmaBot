import { upsertParams } from '../constants';

export const generalizedFindAndOrCreate = async (params: upsertParams) => {
	const { modelName, uniqueId, kvpArray, prisma } = params;


	const d : any = { where: {
		id: Number(uniqueId) },
	// Leave update empty on purpose. This is only to find and create.
	update: {},
	create: {
		id: Number(uniqueId),
	},
	};

	for (const kvp of kvpArray) {
		d.create[kvp.k] = kvp.v;
	}

	const ret = prisma[modelName].upsert(d);
	return ret;
};
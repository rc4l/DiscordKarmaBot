import { upsertParams, upsertParamsSpecial } from '../constants';

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

export const generalizedUpsertSpecial = async (params: upsertParamsSpecial) => {
	const { modelName, uniqueId, kvpArrayCreate, kvpArrayUpdate, prisma } = params;


	const d : any = { where: {
		id: Number(uniqueId) },
	update: {
	},
	create: {
		id: Number(uniqueId),
	},
	};

	for (const kvp of kvpArrayCreate) {
		d.create[kvp.k] = kvp.v;
	}
	for (const kvp of kvpArrayUpdate) {
		d.update[kvp.k] = kvp.v;
	}

	const ret = prisma[modelName].upsert(d);
	return ret;
};
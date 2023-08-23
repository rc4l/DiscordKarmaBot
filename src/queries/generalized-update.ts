import { upsertParams } from '../constants';

export const generalizedUpdate = async (params: upsertParams) => {
	const { modelName, uniqueId, kvpArray, prisma } = params;
	const d : any = { where: {
		id: Number(uniqueId) }, data: {},
	};

	for (const kvp of kvpArray) d.data[kvp.k] = kvp.v;

	// console.log('Model name (update): ' + modelName);
	// console.log(JSON.stringify(d, null, '\t'));

	const ret = prisma[modelName].update(d);

	return ret;
};
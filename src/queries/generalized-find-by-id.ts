import { findByIdParams } from '../constants';

// https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findfirst
export const generalizedFindById = async (params: findByIdParams) => {
	const { kvpArray, modelName, prisma } = params;
	const d : any = { where: { } };
	for (const kvp of kvpArray) d.where[kvp.k] = kvp.v;
	const ret = prisma[modelName].findFirst(d);
	return ret;
};
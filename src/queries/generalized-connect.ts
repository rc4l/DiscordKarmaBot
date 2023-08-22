export const generalizedConnect = async (originModelName: string, originUniqueId: number, relationName: string, relationUniqueId: number, prisma: any) => {
	const d : any = { where: {
		id: Number(originUniqueId) },
	data: { },
	};
	d.data[relationName] = { connectOrCreate: { id: Number(relationUniqueId) } };
	const ret = prisma[originModelName].update(d);
	console.log(JSON.stringify(ret));
	return ret;
};
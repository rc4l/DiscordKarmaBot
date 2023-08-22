export const generalizedCreate = async (modelName: string, id: number, prisma: any) => {
	const ret = prisma[modelName].create({
		data: {
			id: Number(id),
		},
	});
	return ret;
};
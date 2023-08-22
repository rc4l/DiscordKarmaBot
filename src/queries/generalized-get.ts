export const generalizedGet = async (modelName: string, id: number, prisma: any) => {
	const ret = prisma[modelName].findUnique({
		where: {
			id: Number(id),
		},
	});
	return ret;
};
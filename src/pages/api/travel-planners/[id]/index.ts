import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { travelPlannerValidationSchema } from 'validationSchema/travel-planners';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.travel_planner
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getTravelPlannerById();
    case 'PUT':
      return updateTravelPlannerById();
    case 'DELETE':
      return deleteTravelPlannerById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getTravelPlannerById() {
    const data = await prisma.travel_planner.findFirst(convertQueryToPrismaUtil(req.query, 'travel_planner'));
    return res.status(200).json(data);
  }

  async function updateTravelPlannerById() {
    await travelPlannerValidationSchema.validate(req.body);
    const data = await prisma.travel_planner.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteTravelPlannerById() {
    const data = await prisma.travel_planner.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}

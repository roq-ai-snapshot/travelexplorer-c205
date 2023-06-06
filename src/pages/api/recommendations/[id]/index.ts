import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { recommendationValidationSchema } from 'validationSchema/recommendations';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.recommendation
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getRecommendationById();
    case 'PUT':
      return updateRecommendationById();
    case 'DELETE':
      return deleteRecommendationById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getRecommendationById() {
    const data = await prisma.recommendation.findFirst(convertQueryToPrismaUtil(req.query, 'recommendation'));
    return res.status(200).json(data);
  }

  async function updateRecommendationById() {
    await recommendationValidationSchema.validate(req.body);
    const data = await prisma.recommendation.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteRecommendationById() {
    const data = await prisma.recommendation.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}

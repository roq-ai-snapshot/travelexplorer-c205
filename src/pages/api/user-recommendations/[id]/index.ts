import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { userRecommendationValidationSchema } from 'validationSchema/user-recommendations';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.user_recommendation
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getUserRecommendationById();
    case 'PUT':
      return updateUserRecommendationById();
    case 'DELETE':
      return deleteUserRecommendationById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getUserRecommendationById() {
    const data = await prisma.user_recommendation.findFirst(convertQueryToPrismaUtil(req.query, 'user_recommendation'));
    return res.status(200).json(data);
  }

  async function updateUserRecommendationById() {
    await userRecommendationValidationSchema.validate(req.body);
    const data = await prisma.user_recommendation.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteUserRecommendationById() {
    const data = await prisma.user_recommendation.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}

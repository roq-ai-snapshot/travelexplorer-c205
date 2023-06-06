import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { recommendationValidationSchema } from 'validationSchema/recommendations';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getRecommendations();
    case 'POST':
      return createRecommendation();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getRecommendations() {
    const data = await prisma.recommendation
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'recommendation'));
    return res.status(200).json(data);
  }

  async function createRecommendation() {
    await recommendationValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.user_recommendation?.length > 0) {
      const create_user_recommendation = body.user_recommendation;
      body.user_recommendation = {
        create: create_user_recommendation,
      };
    } else {
      delete body.user_recommendation;
    }
    const data = await prisma.recommendation.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}

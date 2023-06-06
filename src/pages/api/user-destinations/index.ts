import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { userDestinationValidationSchema } from 'validationSchema/user-destinations';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getUserDestinations();
    case 'POST':
      return createUserDestination();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getUserDestinations() {
    const data = await prisma.user_destination
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'user_destination'));
    return res.status(200).json(data);
  }

  async function createUserDestination() {
    await userDestinationValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.user_destination.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}

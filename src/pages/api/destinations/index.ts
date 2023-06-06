import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { destinationValidationSchema } from 'validationSchema/destinations';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getDestinations();
    case 'POST':
      return createDestination();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getDestinations() {
    const data = await prisma.destination
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'destination'));
    return res.status(200).json(data);
  }

  async function createDestination() {
    await destinationValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.recommendation?.length > 0) {
      const create_recommendation = body.recommendation;
      body.recommendation = {
        create: create_recommendation,
      };
    } else {
      delete body.recommendation;
    }
    if (body?.user_destination?.length > 0) {
      const create_user_destination = body.user_destination;
      body.user_destination = {
        create: create_user_destination,
      };
    } else {
      delete body.user_destination;
    }
    if (body?.user_feedback?.length > 0) {
      const create_user_feedback = body.user_feedback;
      body.user_feedback = {
        create: create_user_feedback,
      };
    } else {
      delete body.user_feedback;
    }
    const data = await prisma.destination.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}

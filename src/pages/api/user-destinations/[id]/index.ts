import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { userDestinationValidationSchema } from 'validationSchema/user-destinations';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.user_destination
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getUserDestinationById();
    case 'PUT':
      return updateUserDestinationById();
    case 'DELETE':
      return deleteUserDestinationById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getUserDestinationById() {
    const data = await prisma.user_destination.findFirst(convertQueryToPrismaUtil(req.query, 'user_destination'));
    return res.status(200).json(data);
  }

  async function updateUserDestinationById() {
    await userDestinationValidationSchema.validate(req.body);
    const data = await prisma.user_destination.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteUserDestinationById() {
    const data = await prisma.user_destination.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}

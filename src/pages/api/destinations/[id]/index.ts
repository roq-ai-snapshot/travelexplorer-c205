import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { destinationValidationSchema } from 'validationSchema/destinations';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.destination
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getDestinationById();
    case 'PUT':
      return updateDestinationById();
    case 'DELETE':
      return deleteDestinationById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getDestinationById() {
    const data = await prisma.destination.findFirst(convertQueryToPrismaUtil(req.query, 'destination'));
    return res.status(200).json(data);
  }

  async function updateDestinationById() {
    await destinationValidationSchema.validate(req.body);
    const data = await prisma.destination.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteDestinationById() {
    const data = await prisma.destination.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}

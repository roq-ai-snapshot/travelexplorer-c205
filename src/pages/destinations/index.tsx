import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Button, Link } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getDestinations, deleteDestinationById } from 'apiSdk/destinations';
import { DestinationInterface } from 'interfaces/destination';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function DestinationListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<DestinationInterface[]>(
    () => '/destinations',
    () =>
      getDestinations({
        relations: ['travel_planner', 'recommendation.count', 'user_destination.count', 'user_feedback.count'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteDestinationById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Destination
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {hasAccess('destination', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <Link href={`/destinations/create`}>
            <Button colorScheme="blue" mr="4">
              Create
            </Button>
          </Link>
        )}
        {error && <Error error={error} />}
        {deleteError && <Error error={deleteError} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>name</Th>
                  <Th>description</Th>
                  {hasAccess('travel_planner', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>travel_planner</Th>
                  )}
                  {hasAccess('recommendation', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>recommendation</Th>
                  )}
                  {hasAccess('user_destination', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>user_destination</Th>
                  )}
                  {hasAccess('user_feedback', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>user_feedback</Th>
                  )}
                  {hasAccess('destination', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && <Th>Edit</Th>}
                  {hasAccess('destination', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>View</Th>}
                  {hasAccess('destination', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && <Th>Delete</Th>}
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr key={record.id}>
                    <Td>{record.name}</Td>
                    <Td>{record.description}</Td>
                    {hasAccess('travel_planner', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/travel-planners/view/${record.travel_planner?.id}`}>
                          {record.travel_planner?.name}
                        </Link>
                      </Td>
                    )}
                    {hasAccess('recommendation', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>{record?._count?.recommendation}</Td>
                    )}
                    {hasAccess('user_destination', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>{record?._count?.user_destination}</Td>
                    )}
                    {hasAccess('user_feedback', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>{record?._count?.user_feedback}</Td>
                    )}
                    {hasAccess('destination', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <NextLink href={`/destinations/edit/${record.id}`} passHref legacyBehavior>
                          <Button as="a">Edit</Button>
                        </NextLink>
                      </Td>
                    )}
                    {hasAccess('destination', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <NextLink href={`/destinations/view/${record.id}`} passHref legacyBehavior>
                          <Button as="a">View</Button>
                        </NextLink>
                      </Td>
                    )}
                    {hasAccess('destination', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Button onClick={() => handleDelete(record.id)}>Delete</Button>
                      </Td>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </AppLayout>
  );
}
export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'destination',
  operation: AccessOperationEnum.READ,
})(DestinationListPage);

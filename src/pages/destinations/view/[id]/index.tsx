import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button, Link } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getDestinationById } from 'apiSdk/destinations';
import { Error } from 'components/error';
import { DestinationInterface } from 'interfaces/destination';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { deleteRecommendationById } from 'apiSdk/recommendations';
import { deleteUserDestinationById } from 'apiSdk/user-destinations';
import { deleteUserFeedbackById } from 'apiSdk/user-feedbacks';

function DestinationViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<DestinationInterface>(
    () => (id ? `/destinations/${id}` : null),
    () =>
      getDestinationById(id, {
        relations: ['travel_planner', 'recommendation', 'user_destination', 'user_feedback'],
      }),
  );

  const recommendationHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteRecommendationById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const user_destinationHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteUserDestinationById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const user_feedbackHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteUserFeedbackById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Destination Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="lg" fontWeight="bold" as="span">
              Name:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.name}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              Description:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.description}
            </Text>
            <br />
            {hasAccess('travel_planner', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Travel Planner:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  <Link as={NextLink} href={`/travel-planners/view/${data?.travel_planner?.id}`}>
                    {data?.travel_planner?.name}
                  </Link>
                </Text>
              </>
            )}
            {hasAccess('recommendation', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold">
                  Recommendations:
                </Text>
                <NextLink passHref href={`/recommendations/create?destination_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4" as="a">
                    Create
                  </Button>
                </NextLink>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>title</Th>
                        <Th>description</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.recommendation?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.title}</Td>
                          <Td>{record.description}</Td>
                          <Td>
                            <NextLink passHref href={`/recommendations/edit/${record.id}`}>
                              <Button as="a">Edit</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <NextLink passHref href={`/recommendations/view/${record.id}`}>
                              <Button as="a">View</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <Button onClick={() => recommendationHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}

            {hasAccess('user_destination', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold">
                  User Destinations:
                </Text>
                <NextLink passHref href={`/user-destinations/create?destination_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4" as="a">
                    Create
                  </Button>
                </NextLink>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.user_destination?.map((record) => (
                        <Tr key={record.id}>
                          <Td>
                            <NextLink passHref href={`/user-destinations/edit/${record.id}`}>
                              <Button as="a">Edit</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <NextLink passHref href={`/user-destinations/view/${record.id}`}>
                              <Button as="a">View</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <Button onClick={() => user_destinationHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}

            {hasAccess('user_feedback', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold">
                  User Feedbacks:
                </Text>
                <NextLink passHref href={`/user-feedbacks/create?destination_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4" as="a">
                    Create
                  </Button>
                </NextLink>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>rating</Th>
                        <Th>comment</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.user_feedback?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.rating}</Td>
                          <Td>{record.comment}</Td>
                          <Td>
                            <NextLink passHref href={`/user-feedbacks/edit/${record.id}`}>
                              <Button as="a">Edit</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <NextLink passHref href={`/user-feedbacks/view/${record.id}`}>
                              <Button as="a">View</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <Button onClick={() => user_feedbackHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'destination',
  operation: AccessOperationEnum.READ,
})(DestinationViewPage);

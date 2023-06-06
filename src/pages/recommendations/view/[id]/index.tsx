import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button, Link } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getRecommendationById } from 'apiSdk/recommendations';
import { Error } from 'components/error';
import { RecommendationInterface } from 'interfaces/recommendation';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { deleteUserRecommendationById } from 'apiSdk/user-recommendations';

function RecommendationViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<RecommendationInterface>(
    () => (id ? `/recommendations/${id}` : null),
    () =>
      getRecommendationById(id, {
        relations: ['destination', 'user_recommendation'],
      }),
  );

  const user_recommendationHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteUserRecommendationById(id);
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
        Recommendation Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="lg" fontWeight="bold" as="span">
              Title:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.title}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              Description:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.description}
            </Text>
            <br />
            {hasAccess('destination', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Destination:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  <Link as={NextLink} href={`/destinations/view/${data?.destination?.id}`}>
                    {data?.destination?.name}
                  </Link>
                </Text>
              </>
            )}
            {hasAccess('user_recommendation', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold">
                  User Recommendations:
                </Text>
                <NextLink passHref href={`/user-recommendations/create?recommendation_id=${data?.id}`}>
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
                      {data?.user_recommendation?.map((record) => (
                        <Tr key={record.id}>
                          <Td>
                            <NextLink passHref href={`/user-recommendations/edit/${record.id}`}>
                              <Button as="a">Edit</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <NextLink passHref href={`/user-recommendations/view/${record.id}`}>
                              <Button as="a">View</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <Button onClick={() => user_recommendationHandleDelete(record.id)}>Delete</Button>
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
  entity: 'recommendation',
  operation: AccessOperationEnum.READ,
})(RecommendationViewPage);

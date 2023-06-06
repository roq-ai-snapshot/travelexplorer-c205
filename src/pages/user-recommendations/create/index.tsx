import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createUserRecommendation } from 'apiSdk/user-recommendations';
import { Error } from 'components/error';
import { userRecommendationValidationSchema } from 'validationSchema/user-recommendations';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { RecommendationInterface } from 'interfaces/recommendation';
import { getUsers } from 'apiSdk/users';
import { getRecommendations } from 'apiSdk/recommendations';
import { UserRecommendationInterface } from 'interfaces/user-recommendation';

function UserRecommendationCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: UserRecommendationInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createUserRecommendation(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<UserRecommendationInterface>({
    initialValues: {
      user_id: (router.query.user_id as string) ?? null,
      recommendation_id: (router.query.recommendation_id as string) ?? null,
    },
    validationSchema: userRecommendationValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create User Recommendation
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <AsyncSelect<RecommendationInterface>
            formik={formik}
            name={'recommendation_id'}
            label={'Select Recommendation'}
            placeholder={'Select Recommendation'}
            fetcher={getRecommendations}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.title}
              </option>
            )}
          />
          <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'user_recommendation',
  operation: AccessOperationEnum.CREATE,
})(UserRecommendationCreatePage);

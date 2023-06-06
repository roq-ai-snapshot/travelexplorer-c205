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
import { createUserDestination } from 'apiSdk/user-destinations';
import { Error } from 'components/error';
import { userDestinationValidationSchema } from 'validationSchema/user-destinations';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { DestinationInterface } from 'interfaces/destination';
import { getUsers } from 'apiSdk/users';
import { getDestinations } from 'apiSdk/destinations';
import { UserDestinationInterface } from 'interfaces/user-destination';

function UserDestinationCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: UserDestinationInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createUserDestination(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<UserDestinationInterface>({
    initialValues: {
      user_id: (router.query.user_id as string) ?? null,
      destination_id: (router.query.destination_id as string) ?? null,
    },
    validationSchema: userDestinationValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create User Destination
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
          <AsyncSelect<DestinationInterface>
            formik={formik}
            name={'destination_id'}
            label={'Select Destination'}
            placeholder={'Select Destination'}
            fetcher={getDestinations}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
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
  entity: 'user_destination',
  operation: AccessOperationEnum.CREATE,
})(UserDestinationCreatePage);

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
import { createDestination } from 'apiSdk/destinations';
import { Error } from 'components/error';
import { destinationValidationSchema } from 'validationSchema/destinations';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { TravelPlannerInterface } from 'interfaces/travel-planner';
import { getUsers } from 'apiSdk/users';
import { UserInterface } from 'interfaces/user';
import { getTravelPlanners } from 'apiSdk/travel-planners';
import { DestinationInterface } from 'interfaces/destination';

function DestinationCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: DestinationInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createDestination(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<DestinationInterface>({
    initialValues: {
      name: '',
      description: '',
      travel_planner_id: (router.query.travel_planner_id as string) ?? null,
      recommendation: [],
      user_destination: [],
      user_feedback: [],
    },
    validationSchema: destinationValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Destination
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
            <FormLabel>Name</FormLabel>
            <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
            {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
          </FormControl>
          <FormControl id="description" mb="4" isInvalid={!!formik.errors?.description}>
            <FormLabel>Description</FormLabel>
            <Input type="text" name="description" value={formik.values?.description} onChange={formik.handleChange} />
            {formik.errors.description && <FormErrorMessage>{formik.errors?.description}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<TravelPlannerInterface>
            formik={formik}
            name={'travel_planner_id'}
            label={'Select Travel Planner'}
            placeholder={'Select Travel Planner'}
            fetcher={getTravelPlanners}
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
  entity: 'destination',
  operation: AccessOperationEnum.CREATE,
})(DestinationCreatePage);

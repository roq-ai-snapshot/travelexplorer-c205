import * as yup from 'yup';

export const userDestinationValidationSchema = yup.object().shape({
  user_id: yup.string().nullable().required(),
  destination_id: yup.string().nullable().required(),
});

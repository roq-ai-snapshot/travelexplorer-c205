import * as yup from 'yup';
import { destinationValidationSchema } from 'validationSchema/destinations';

export const travelPlannerValidationSchema = yup.object().shape({
  name: yup.string().required(),
  user_id: yup.string().nullable().required(),
  destination: yup.array().of(destinationValidationSchema),
});

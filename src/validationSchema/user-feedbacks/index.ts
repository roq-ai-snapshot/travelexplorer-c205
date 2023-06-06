import * as yup from 'yup';

export const userFeedbackValidationSchema = yup.object().shape({
  rating: yup.number().integer().required(),
  comment: yup.string(),
  user_id: yup.string().nullable().required(),
  destination_id: yup.string().nullable().required(),
});

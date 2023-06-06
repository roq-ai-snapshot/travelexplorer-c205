import * as yup from 'yup';

export const userRecommendationValidationSchema = yup.object().shape({
  user_id: yup.string().nullable().required(),
  recommendation_id: yup.string().nullable().required(),
});

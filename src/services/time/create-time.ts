import { gql } from '@apollo/client';
import { client } from '../apollo-client';
import { Time, TimeInput } from '../../types/time';

// Create a time slot mutation
const CREATE_TIME_MUTATION = gql`
  mutation CreateTime($input: TimeInput!) {
    createTime(input: $input) {
      id
      role
      date
      hours
    }
  }
`;

// Create a time slot
export const createTime = async (input: TimeInput): Promise<Time> => {
  const { data } = await client.mutate<{ createTime: Time }>({
    mutation: CREATE_TIME_MUTATION,
    variables: { input },
  });
  
  return data?.createTime as Time;
};

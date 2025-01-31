/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSources, TGenericErrorResponse } from './error.interface';

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  // Extract value within double quotes using regex
  const match = err.message.match(/"([^"]*)"/);

  // The extracted value will be in the first capturing group
  const extractedMessage = match && match[1];

  const errorSources: TErrorSources = [
    {
      path: '',
      message: `${extractedMessage} already exists`,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: `${extractedMessage} already exists`,
    errorSources,
  };
};

export default handleDuplicateError;

import { HttpException, InternalServerErrorException } from '@nestjs/common';

export const kafkaResponseErrorWrapper = async (error: any) => {
  if (error.message && error.statusCode && error.error) {
    throw new HttpException(error.message, error.statusCode, {
      description: error.error,
    });
  }

  throw new InternalServerErrorException(error.message);
};

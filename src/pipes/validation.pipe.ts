import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

export const setupGlobalPipes = (app: NestExpressApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const formatErrors = (validationErrors) => {
          return validationErrors.flatMap((error) => {
            if (error.constraints) {
              return {
                field: error.property,
                errors: Object.values(error.constraints),
              };
            } else if (error.children && error.children.length > 0) {
              return formatErrors(error.children).map((nestedError) => ({
                field: `${error.property}.${nestedError.field}`,
                errors: nestedError.errors,
              }));
            }
            return [];
          });
        };

        const formattedErrors = formatErrors(errors);

        return new BadRequestException({
          message: 'Validation failed',
          errors: formattedErrors,
        });
      },
    }),
  );
};

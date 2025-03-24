import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: any) {
    try {
      const parsedValue = this.schema.parse(value);

      if (parsedValue) {
        console.log('# ZOD VALIDATION');
        console.log('# Success: ok');
        console.log('# # # # # # # #');
      }

      return parsedValue;
    } catch (err) {
      if (err instanceof ZodError) {
        err.issues.forEach((issue) => {
          console.log(
            `Erro no caminho ${issue.path.join('.')}: ${issue.message}`,
          );
        });
      }
      throw new BadRequestException('Validation failed');
    }
  }
}

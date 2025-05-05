import type { PipeTransform } from '@nestjs/common'
import { BadRequestException } from '@nestjs/common'
import type { ZodSchema } from 'zod'
import { ZodError } from 'zod'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    console.log('# ZOD VALIDATION')
    try {
      const parsedValue = this.schema.parse(value)

      if (parsedValue) {
        console.log('# Success: ok')
      }

      return parsedValue
    } catch (err) {
      if (err instanceof ZodError) {
        err.issues.forEach((issue) => {
          console.log(
            `# Erro no caminho ${issue.path.join('.')}: ${issue.message}`
          )
        })
      }
      console.log('# # # # # # # #')
      throw new BadRequestException('Validation failed')
    }
  }
}

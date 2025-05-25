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

      return parsedValue
    } catch (err) {
      if (err instanceof ZodError) {
        const zodErrors = []
        err.issues.forEach((issue) => {
          zodErrors.push(issue.path.join('.'))
          console.log(
            `# ERR Propriedade inválida: ${issue.path.join('.')}`,
            `EXPECTED: ${(issue as { expected: string }).expected}`,
            `RECEIVED: ${(issue as { expected: string }).expected}`
          )
        })

        throw new BadRequestException(
          `Validation failed for: ${zodErrors.join(', ')}`
        )
      }
    }
  }
}

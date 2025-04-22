import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

import { AppModule } from './app.module'
import { HttpExceptionFilter } from './shared/filters/http-exception-filter'
import { ResponseInterceptor } from './shared/interceptors/response.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
  app.enableCors({
    origin: ['*', 'http://localhost:3000'],
    methods: ['POST', 'PUT', 'DELETE', 'GET']
  })
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new ResponseInterceptor())

  const config = new DocumentBuilder()
    .setTitle('Teto de Vidro - API')
    .setDescription('Descrição dos endpoints disponíveis no projeto')
    .setVersion('1.0')
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, documentFactory)

  await app.listen(Number(process.env.PORT) || 3000)
}
bootstrap()

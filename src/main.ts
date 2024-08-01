import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.setGlobalPrefix('api')
	app.use(cookieParser())
	app.enableCors({
		origin: (origin, callback) => {
			const allowedOrigins = ['http://localhost:3002', 'http://localhost:8088', 'http://193.22.147.125:8088', 'https://193.22.147.125:8088'];
			if (allowedOrigins.includes(origin) || !origin) {
				callback(null, true) // allowed
			} else {
				callback(new Error('Not allowed by CORS')) // not allowed
			}
		},
		credentials: true,
		exposedHeaders: 'set-cookie'
	})

	await app.listen(4200)
}
bootstrap()

import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

// export const connectDB = (
//   configService: ConfigService,
// ): MongooseModuleOptions => ({
//   uri: configService.get<string>('MONGODB_URI'),
//   autoIndex: true,
// });

export const connectDB = async (
  configService: ConfigService,
): Promise<MongooseModuleOptions> => {
  const uri = configService.get<string>('MONGODB_URI');
  if (!uri) {
    throw new Error('Please provide MONGODB_URI in the environment variables');
  }
  return {
    uri,
    connectionFactory: (conn) => {
      if (conn.readyState === 1) {
        console.log('✅ Database connected');
      }

      conn.on('error', (error: Error) => {
        console.error('Database connection error:', error);
        process.exit(1);
      });

      conn.on('disconnected', () => {
        console.log('Database disconnected');
        process.exit(1);
      });

      return conn;
    },
  };
};

export const corsConfig = (): CorsOptions => {
  return {
    origin: process.env.CLIENT_URL,
    methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    credentials: true,
  };
};

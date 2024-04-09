import { KafkaOptions, Transport } from '@nestjs/microservices';

export const authMicroserviceConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'auth',
      brokers: ['localhost:9092'],
    },
    // producerOnlyMode: true,
    consumer: {
      groupId: 'auth-consumer',
    },
  },
};

import { KafkaOptions, Transport } from '@nestjs/microservices';

export const postsMicroserviceConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'posts',
      brokers: ['localhost:9092'],
    },
    // producerOnlyMode: true,
    consumer: {
      groupId: 'posts-consumer',
    },
  },
};

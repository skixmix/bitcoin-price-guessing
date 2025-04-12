import { FastifyRequest } from 'fastify';

export interface IFastifyRequestWithUserId extends FastifyRequest {
    userId: number;
}

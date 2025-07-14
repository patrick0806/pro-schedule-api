import type { FastifyRequest } from 'fastify';

import { IAccessToken } from './tokens.interface';

export interface IRequest extends FastifyRequest {
  user: IAccessToken;
}

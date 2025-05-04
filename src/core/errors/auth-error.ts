import { DomainError } from './domain-error';

export class UnauthorizedError extends DomainError {
  constructor(message: string = 'Acesso não autorizado') {
    super(message);
  }
}

export class TokenMissingError extends UnauthorizedError {
  constructor() {
    super('Token de autenticação não encontrado');
  }
}

export class TokenInvalidError extends UnauthorizedError {
  constructor() {
    super('Token de autenticação inválido ou expirado');
  }
}

export class ForbiddenResourceError extends DomainError {
  constructor(userId: string, resourceId: string) {
    super(`Usuário ${userId} não tem permissão para acessar o recurso ${resourceId}`);
  }
}

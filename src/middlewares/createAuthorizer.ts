import { MiddlewareContext } from '../discord';

export const createAuthorizer = (options: CreateAuthorizerOptions) => {
  return ({ interaction }: MiddlewareContext): void => {
    if (!options.authorizedUserIds.includes(interaction.user.id)) {
      throw new Error('You are not authorized to do this action');
    }
  }
}

export interface CreateAuthorizerOptions {
  authorizedUserIds: string[];
}

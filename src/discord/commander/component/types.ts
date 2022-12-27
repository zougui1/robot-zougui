import { Reply } from '../../Reply';
import { ReplyableInteraction } from '../../types';

export interface ComponentBuilder {
  setCustomId(id: string): this;
}

export interface ComponentActionContext<
  Interaction extends ReplyableInteraction,
  Options extends Record<string, string>,
> {
  interaction: Interaction;
  options: Options;
  reply: Reply;
}

export interface CreatedComponent<Builder extends ComponentBuilder> {
  builder: Builder;
  idType: 'payload' | 'generated';
  onceDeletedFromCache: ((callback: () => void) => void) | undefined;
}

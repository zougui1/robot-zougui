import { SelectMenuInteraction, ButtonInteraction, ModalSubmitInteraction, Message, BaseMessageOptions } from 'discord.js';

import { MessageBuilder } from './Message';
import { getErrorMessage, Queue } from '../utils';
import { ReplyableInteraction } from './types';

export class Reply {
  #interaction: ReplyableInteraction;
  readonly message: MessageBuilder = new MessageBuilder();
  debug: boolean;
  #replied: boolean = false;
  components: BaseMessageOptions['components'];
  #originalReply: Message | undefined;
  readonly originalMessage: MessageBuilder = new MessageBuilder();
  #originalComponents: BaseMessageOptions['components'];
  #queue: Queue<Message> = new Queue();

  constructor(interaction: ReplyableInteraction, options?: ReplyOptions | undefined) {
    this.#interaction = interaction;
    this.debug = options?.debug ?? false;
  }

  async toggleDebug(): Promise<void> {
    this.debug = !this.debug;
    await this.reply();
  }

  async disableDebug(): Promise<void> {
    if (this.debug) {
      await this.toggleDebug();
    }
  }

  async sendContent(content: string): Promise<Message<boolean>> {
    this.message.reply.content = content;
    return await this.reply();
  }

  async sendComponents(components: BaseMessageOptions['components']): Promise<Message<boolean>> {
    this.components = components;
    return await this.reply();
  }

  async respond(label: string, content?: string | undefined): Promise<Message<boolean>> {
    this.message.setResponse(label, content);
    return await this.reply();
  }

  async respondSuccess(label: string, content?: string | undefined): Promise<Message<boolean>> {
    return await this.respond(`✅\n${label}`, content);
  }

  async respondError(label: string, error?: unknown): Promise<Message<boolean>> {
    return await this.respond(`❌\n**Error**:\n${label}`, getErrorMessage(error));
  }

  async fetchOriginalReply(): Promise<Message<boolean>> {
    if (
      !(this.#interaction instanceof SelectMenuInteraction) &&
      !(this.#interaction instanceof ButtonInteraction) &&
      !(this.#interaction instanceof ModalSubmitInteraction)
    ) {
      throw new Error('The function "updateOriginalReply" must be used on a component interaction');
    }

    const interaction = this.#interaction;

    this.#replied = true;
    this.#originalReply = await this.#queue.run(() => interaction.deferUpdate({
      fetchReply: true,
    }));
    this.originalMessage.reply.content = this.#originalReply.content;
    this.#originalComponents = this.#originalReply.components;

    return this.#originalReply;
  }

  async editOriginalReply(): Promise<Message<boolean>> {
    if (!this.#originalReply) {
      throw new Error('Must fetch the original message first');
    }

    if (this.debug) {
      this.message.reply.content ||= '*No content*';
    }

    const content = this.originalMessage.toString({ debug: this.debug });

    return await this.#queue.run(() => this.#interaction.editReply({
      content,
      components: this.#originalComponents,
    }));
  }

  removeComponents(): this {
    this.components = [];
    return this;
  }

  removeOriginalComponents(): this {
    this.#originalComponents = [];
    return this;
  }

  async defer(): Promise<Message<boolean>> {
    this.#replied = true;
    return await this.#queue.run(() => this.#interaction.deferReply({
      fetchReply: true,
    }));
  }

  async reply(): Promise<Message<boolean>> {
    if (this.debug) {
      this.message.reply.content ||= '*No content*';
    }

    const content = this.message.toString({ debug: this.debug });

    if (this.#originalReply) {
      if (!this.#interaction.channel) {
        throw new Error('Cannot reply to a message from a channel that is not present in the cache');
      }

      const { channel } = this.#interaction;
      const originalReply = this.#originalReply;

      return await this.#queue.run(() => channel.send({
        content,
        components: this.components,
        reply: { messageReference: originalReply },
      }));
    }

    if (this.#replied) {
      return await this.#queue.run(() => this.#interaction.editReply({
        content,
        components: this.components,
      }));
    }

    this.#replied = true;
    return await this.#queue.run(() => this.#interaction.reply({
      content,
      fetchReply: true,
      components: this.components,
    }));
  }
}

export interface ReplyOptions {
  debug?: boolean | undefined;
}

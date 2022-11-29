import { ChatInputCommandInteraction, SelectMenuInteraction, Message, BaseMessageOptions } from 'discord.js';

import { MessageBuilder } from './Message';
import { getErrorMessage } from '../utils';

export class Reply {
  #interaction: ChatInputCommandInteraction | SelectMenuInteraction;
  readonly message: MessageBuilder = new MessageBuilder();
  debug: boolean;
  #replied: boolean = false;
  #components: BaseMessageOptions['components'];
  #originalReply: Message | undefined;
  readonly originalMessage: MessageBuilder = new MessageBuilder();
  #originalComponents: BaseMessageOptions['components'];

  constructor(interaction: ChatInputCommandInteraction | SelectMenuInteraction, options?: ReplyOptions | undefined) {
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
    this.#components = components;
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
    if (!(this.#interaction instanceof SelectMenuInteraction)) {
      throw new Error('The function "updateOriginalReply" must be used on a SelectMenuInteraction');
    }

    this.#replied = true;
    this.#originalReply = await this.#interaction.deferUpdate({
      fetchReply: true,
    });
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

    return await this.#interaction.editReply({
      content,
      components: this.#originalComponents,
    });
  }

  removeComponents(): this {
    this.#components = [];
    return this;
  }

  removeOriginalComponents(): this {
    this.#originalComponents = [];
    return this;
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

      return await this.#interaction.channel.send({
        content,
        components: this.#components,
        reply: { messageReference: this.#originalReply },
      });
    }

    if (this.#replied) {
      return await this.#interaction.editReply({
        content,
        components: this.#components,
      });
    }

    this.#replied = true;
    return await this.#interaction.reply({
      content,
      fetchReply: true,
      components: this.#components,
    });
  }
}

export interface ReplyOptions {
  debug?: boolean | undefined;
}

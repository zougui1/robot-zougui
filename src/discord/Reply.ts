import {
  SelectMenuInteraction,
  ButtonInteraction,
  ModalSubmitInteraction,
  Message,
  BaseMessageOptions,
} from 'discord.js';

import { MessageBuilder } from './Message';
import { hasDiscordWebhookTokenExpired } from './utils';
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
  originalComponents: BaseMessageOptions['components'];
  #queue: Queue<Message> = new Queue();
  #discordMessage: Message<boolean> | undefined;

  constructor(interaction: ReplyableInteraction, options?: ReplyOptions | undefined) {
    this.#interaction = interaction;
    this.debug = options?.debug ?? false;
  }

  async toggleDebug(): Promise<void> {
    await this.#queue.run(async () => {
      this.debug = !this.debug;
      return await this._reply();
    });
  }

  async disableDebug(): Promise<void> {
    if (this.debug) {
      await this.toggleDebug();
    }
  }

  async sendContent(content: string): Promise<Message<boolean>> {
    return await this.#queue.run(async () => {
      this.message.reply.content = content;
      return await this._reply();
    });
  }

  async sendComponents(components: BaseMessageOptions['components']): Promise<Message<boolean>> {
    return await this.#queue.run(async () => {
      this.components = components;
      return await this._reply();
    });
  }

  async respond(label: string, content?: string | undefined): Promise<Message<boolean>> {
    return await this.#queue.run(async () => {
      this.message.setResponse(label, content);
      return await this._reply();
    });
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
    this.originalComponents = this.#originalReply.components;

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

    return await this.#queue.run(async () => {
      try {
        this.#discordMessage = await this.#interaction.editReply({
          content,
          components: this.originalComponents,
        });
        return this.#discordMessage;
      } catch (error) {
        if (
          !hasDiscordWebhookTokenExpired(error) ||
          !this.#discordMessage
        ) {
          throw error;
        }

        this.#discordMessage = await this.#discordMessage.edit({
          content,
          components: this.originalComponents,
        });
        return this.#discordMessage;
      }
    });
  }

  removeComponents(): this {
    this.components = [];
    return this;
  }

  removeOriginalComponents(): this {
    this.originalComponents = [];
    return this;
  }

  async defer(): Promise<Message<boolean>> {
    this.#replied = true;
    return await this.#queue.run(() => this.#interaction.deferReply({
      fetchReply: true,
    }));
  }

  async reply(): Promise<Message> {
    return await this.#queue.run(async () => await this._reply());
  }

  private async _reply(): Promise<Message<boolean>> {
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

      this.#discordMessage = await channel.send({
        content,
        components: this.components,
        reply: { messageReference: originalReply },
      });
      return this.#discordMessage;
    }

    if (this.#replied) {
      try {
        this.#discordMessage = await this.#interaction.editReply({
          content,
          components: this.components,
        });
        return this.#discordMessage;
      } catch (error) {
        if (
          !hasDiscordWebhookTokenExpired(error) ||
          !this.#discordMessage
        ) {
          throw error;
        }

        this.#discordMessage = await this.#discordMessage.edit({
          content,
          components: this.components,
        });
        return this.#discordMessage;
      }
    }

    this.#replied = true;

    try {
      this.#discordMessage = await this.#interaction.reply({
        content,
        fetchReply: true,
        components: this.components,
      });
      return this.#discordMessage;
    } catch (error) {
      if (
        !hasDiscordWebhookTokenExpired(error) ||
        !this.#interaction.channel
      ) {
        throw error;
      }

      this.#discordMessage = await this.#interaction.channel.send({
        content,
        components: this.components,

      });
      return this.#discordMessage;
    }
  }
}

export interface ReplyOptions {
  debug?: boolean | undefined;
}

export class MessageBuilder {
  readonly options: MessageSection<MessageItem> = new MessageSection('Options');
  readonly reply: MessageItem = { label: 'Reply', content: '' };
  response: { label: string; content?: string | undefined } | undefined;

  addOptions(options: Record<string, unknown>): this {
    for (const [key, value] of Object.entries(options)) {
      this.options.addItem({
        label: key,
        content: JSON.stringify(value),
      });
    }

    return this;
  }

  setResponse(label: string, content?: string | undefined): this {
    this.response = { label, content };
    return this;
  }

  toString({ debug }: { debug?: boolean | undefined } = {}): string {
    const reply = formatSection(this.reply, { withLabel: debug });
    const response = this.response
      ? formatSection({
        label: this.response.label,
        content: debug ? this.response.content : '',
      }, { withLabel: true }).split('\n').map(line => `> ${line}`).join('\n')
      : '';

    if (!debug) {
      return `${reply}\n\n${response}`.trim();
    }

    const debugInfo = `**Debug mode enabled**`;
    const options = this.options.toString({ withLabel: debug });

    return `${debugInfo}\n\n${options}\n\n${reply}\n\n${response}`.trim();
  }
}

export interface Section {
  label: string;
  content: string;
}

export interface MessageItem {
  label: string;
  content: string;
}

export class MessageSection<ContentType extends string | MessageItem = string | MessageItem> {
  readonly label: string;
  readonly content: ContentType[] = [];

  constructor(label: string) {
    this.label = label;
  }

  addItem(item: ContentType): this {
    this.content.push(item);
    return this;
  }

  toString(options: FormatSectionOptions = {}): string {
    const content = this.content.map(text => {
      const textContent = typeof text === 'string'
        ? text
        : `${text.label}: ${text.content}`;

      return `- ${textContent}`;
    }).join('\n');

    const section: Section = {
      label: this.label,
      content,
    };

    return formatSection(section, options)
  }
}

export const formatSection = (section: { label: string; content?: string | undefined }, options: FormatSectionOptions = {}): string => {
  const content = section.content?.trim() || '';

  if (!options.withLabel) {
    return content;
  }

  const label = `__${section.label}__`;

  if (!content) {
    return label;
  }

  return `${label}:\n${content}`;
}

export interface FormatSectionOptions {
  withLabel?: boolean | undefined;
}

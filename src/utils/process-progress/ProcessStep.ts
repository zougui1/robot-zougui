export class ProcessStep {
  readonly title: string;
  readonly success: Readonly<StepMessage>;
  readonly running: Readonly<StepMessage>;
  readonly warning: Readonly<StepMessage> | undefined;
  readonly error: Readonly<StepMessage>;
  readonly done: boolean;
  readonly errored: boolean;
  readonly warned: boolean | undefined;

  constructor(options: ProcessStepOptions) {
    this.title = options.title;
    this.success = options.success;
    this.running = options.running;
    this.warning = options.warning;
    this.error = options.error;
    this.done = options.done;
    this.errored = options.errored;
    this.warned = options.warned;
  }

  toString(): string {
    const message = this.getMessage();
    return `${this.title}: ${message}`;
  }

  private getMessage(): string {
    const icon = this.getIcon();
    const content = this.getContent();

    return icon ? `${icon} ${content}` : content;
  }

  private getContent(): string {
    if (this.done) {
      return this.success.content;
    }

    if (this.warned && this.warning) {
      return this.warning.content;
    }

    if (this.errored) {
      return this.error.content;
    }

    return this.running.content;
  }

  private getIcon(): string | undefined {
    if (this.done) {
      return this.success.icon;
    }

    if (this.warned && this.warning) {
      return this.warning.icon;
    }

    if (this.errored) {
      return this.error.icon;
    }

    return this.running.icon;
  }
}

export interface ProcessStepOptions {
  title: string;
  success: StepMessage;
  running: StepMessage;
  warning?: StepMessage | undefined;
  error: StepMessage;
  done: boolean;
  errored: boolean;
  warned?: boolean | undefined;
}

export interface StepMessage {
  icon?: string | undefined;
  content: string;
}

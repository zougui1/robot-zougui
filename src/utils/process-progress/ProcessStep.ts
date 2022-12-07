export class ProcessStep {
  readonly title: string;
  readonly success: Readonly<StepMessage>;
  readonly running: Readonly<StepMessage>;
  readonly error: Readonly<StepMessage>;
  readonly done: boolean;
  readonly errored: boolean;

  constructor(options: ProcessStepOptions) {
    this.title = options.title;
    this.success = options.success;
    this.running = options.running;
    this.error = options.error;
    this.done = options.done;
    this.errored = options.errored;
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

    if (this.errored) {
      return this.error.content;
    }

    return this.running.content;
  }

  private getIcon(): string | undefined {
    if (this.done) {
      return this.success.icon;
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
  error: StepMessage;
  done: boolean;
  errored: boolean;
}

export interface StepMessage {
  icon?: string | undefined;
  content: string;
}

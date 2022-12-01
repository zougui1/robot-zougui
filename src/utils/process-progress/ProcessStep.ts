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
    return `${this.title} ${message}`;
  }

  private getMessage(): string {
    if (this.done) {
      return `${this.success.icon} ${this.success.content}`;
    }

    if (this.errored) {
      return `${this.error.icon} ${this.error.content}`;
    }

    return `${this.running.icon} ${this.running.content}`;
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
  icon: string;
  content: string;
}

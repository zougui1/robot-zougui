import _ from 'radash';
import Emittery from 'emittery';

import { ProcessProgress } from './ProcessProgress';
import { StepMessage } from './ProcessStep';

export class ProcessState<Steps extends string = ''> extends Emittery<ProcessStateEventMap> {
  static readonly #defaultErrorMessage: string = 'An error occured';

  readonly progress: ProcessProgress = new ProcessProgress();
  readonly #steps: Record<Steps, Step> = {} as Record<Steps, Step>;

  addStep<Step extends string>(id: Exclude<Step, ''>, options: AddStateStepOptions): ProcessState<Exclude<Steps | Step, ''>> {
    const newThis = this as ProcessState<Exclude<Steps | Step, ''>>;

    newThis.#steps[id] = {
      index: Object.keys(this.#steps).length,
      options: {
        ...options,
        error: {
          ...options.error,
          content: options.error?.content ?? ProcessState.#defaultErrorMessage,
        },
        warning: {
          ...options.warning,
          content: options.warning?.content ?? options.success.content,
        },
      },
      state: {
        done: false,
        errored: false,
        errorMessage: undefined,
        warned: false,
        warningMessage: undefined,
      },
    };

    return newThis;
  }

  finish(id: Steps): this {
    this.#steps[id].state.done = true;
    this.update();
    return this;
  }

  error(id: Steps, errorMessage?: string | undefined): this {
    this.#steps[id].state.errored = true;
    this.#steps[id].state.errorMessage = errorMessage;
    this.update();
    return this;
  }

  warn(id: Steps, warningMessage?: string | undefined): this {
    this.#steps[id].state.warned = true;
    this.#steps[id].state.warningMessage = warningMessage;
    this.update();
    return this;
  }

  getProgressString(): string {
    const steps = _.sort(Object.values<Step>(this.#steps), step => step.index);
    const progress = new ProcessProgress();

    for (const step of steps) {
      progress.addStep({
        ...step.options,
        ...step.state,
        error: {
          ...step.options.error,
          content: step.state.errorMessage || step.options.error.content,
        },
        warning: {
          ...step.options.warning,
          content: step.state.warningMessage || step.options.warning.content,
        },
      });
    }

    return progress.toString();
  }

  private update(): void {
    const progressString = this.getProgressString();
    this.emit('progress', { progressString });
  }
}

export interface AddStateStepOptions {
  title: string;
  success: StepMessage;
  running: StepMessage;
  error?: Partial<StepMessage> | undefined;
  warning?: Partial<StepMessage> | undefined;
}

type Step = {
  options: {
    title: string;
    success: StepMessage;
    running: StepMessage;
    error: StepMessage;
    warning: StepMessage;
  };
  state: StepState;
  index: number;
}

type StepState = {
  done: boolean;
  errored: boolean;
  errorMessage?: string | undefined;
  warned: boolean;
  warningMessage?: string | undefined;
}

export interface ProcessStateEventMap {
  progress: { progressString: string };
}

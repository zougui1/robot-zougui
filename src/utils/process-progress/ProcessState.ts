import _ from 'radash';
import Emittery from 'emittery';
import { DateTime } from 'luxon';

import { ms } from '@zougui/common.ms';

import { ProcessProgress } from './ProcessProgress';
import { StepMessage } from './ProcessStep';

export class ProcessState<Steps extends string = ''> extends Emittery<ProcessStateEventMap> {
  static readonly #defaultErrorMessage: string = 'An error occured';

  readonly progress: ProcessProgress = new ProcessProgress();
  readonly #steps: Record<Steps, Step<Steps>> = {} as Record<Steps, Step<Steps>>;

  addStep<Step extends string>(id: Exclude<Step, ''>, options: AddStateStepOptions): ProcessState<Exclude<Steps | Step, ''>> {
    const newThis = this as any as ProcessState<Exclude<Steps | Step, ''>>;
    const index = this.getStepCount();

    newThis.#steps[id] = {
      id,
      index,
      options: {
        ...options,
        running: {
          ...options.running,
        },
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
      startedAt: index === 0 ? DateTime.now() : undefined,
    };

    return newThis;
  }

  updateRunningContent(id: Steps, content: string): this {
    this.#steps[id].options.running.content = content;
    return this;
  }

  finish(id: Steps): this {
    if (this.#steps[id].state.done) {
      return this;
    }

    console.log('finish step:', id)
    this.#steps[id].state.done = true;
    this.end(id);
    return this;
  }

  error(id: Steps, errorMessage?: string | undefined): this {
    this.#steps[id].state.errored = true;
    this.#steps[id].state.errorMessage = errorMessage;
    this.end(id);
    return this;
  }

  warn(id: Steps, warningMessage?: string | undefined): this {
    this.#steps[id].state.warned = true;
    this.#steps[id].state.warningMessage = warningMessage;
    this.end(id);
    return this;
  }

  errorCurrent(errorMessage?: string | undefined): this {
    const step = this.getCurrentStep();

    if (step) {
      this.error(step.id, errorMessage);
    }

    return this;
  }

  warnCurrent(warningMessage?: string | undefined): this {
    const step = this.getCurrentStep();

    if (step) {
      this.warn(step.id, warningMessage);
    }

    return this;
  }

  getProgressString(): string {
    const steps = _.sort(Object.values<Step<Steps>>(this.#steps), step => step.index);
    const progress = new ProcessProgress();

    for (const step of steps) {
      const runningContent = step.options.running.content;
      const successContent = step.options.success.content;
      const errorContent = step.state.errorMessage || step.options.error.content;
      const warningContent = step.state.warningMessage || step.options.warning.content;

      const timing = this.getStepTiming(step);
      const timingLabel = timing ? ` (${timing})` : '';

      progress.addStep({
        ...step.options,
        ...step.state,
        running: {
          ...step.options.running,
          content: `${runningContent}${timingLabel}`,
        },
        success: {
          ...step.options.success,
          content: `${successContent}${timingLabel}`,
        },
        error: {
          ...step.options.error,
          content: `${errorContent}${timingLabel}`,
        },
        warning: {
          ...step.options.warning,
          content: `${warningContent}${timingLabel}`,
        },
      });
    }

    return progress.toString();
  }

  getCurrentStep(): Step<Steps> | undefined {
    return Object
      .values<Step<Steps>>(this.#steps)
      .find(step => !step.state.done && !step.state.errored && !step.state.warned);;
  }

  private getNextStep(id: Steps): Step<Steps> | undefined {
    const currentStep = this.#steps[id];
    const nextIndex = currentStep.index + 1;

    return Object
      .values<Step<Steps>>(this.#steps)
      .find(step => step.index === nextIndex);
  }

  private update(): void {
    const progressString = this.getProgressString();
    this.emit('progress', { progressString });
  }

  private end(id: Steps): void {
    this.#steps[id].finishedAt = DateTime.now();

    const nextStep = this.getNextStep(id);

    if (nextStep) {
      nextStep.startedAt = DateTime.now();
    }

    this.update();
  }

  private getStepTiming(step: Step<Steps>): string | undefined {
    if (!step.startedAt) {
      return;
    }

    if (!step.finishedAt) {
      return step.startedAt?.toLocaleString(DateTime.DATETIME_SHORT);
    }

    const difference = step.finishedAt.toMillis() - step.startedAt.toMillis();
    return ms(difference, { format: 'verbose' });
  }

  private getStepCount(): number {
    return Object.keys(this.#steps).length;
  }
}

export interface AddStateStepOptions {
  title: string;
  success: StepMessage;
  running: StepMessage;
  error?: Partial<StepMessage> | undefined;
  warning?: Partial<StepMessage> | undefined;
}

type Step<Steps extends string> = {
  id: Steps;
  options: {
    title: string;
    success: StepMessage;
    running: StepMessage;
    error: StepMessage;
    warning: StepMessage;
  };
  state: StepState;
  index: number;
  startedAt?: DateTime | undefined;
  finishedAt?: DateTime | undefined;
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

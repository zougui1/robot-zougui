import { ProcessStep, StepMessage } from './ProcessStep';

export class ProcessProgress {
  static defaultIcons: Partial<Record<Status, string>> = {};

  readonly #steps: ProcessStep[] = [];

  addStep(options: AddStepOptions): this {
    const step = new ProcessStep({
      ...options,
      running: {
        ...options.running,
        icon: options.running.icon ?? ProcessProgress.defaultIcons.running,
      },
      warning: options.warning ? {
        ...options.warning,
        icon: options.warning.icon ?? ProcessProgress.defaultIcons.warning,
      } : undefined,
      error: {
        ...options.error,
        icon: options.error.icon ?? ProcessProgress.defaultIcons.error,
      },
      success: {
        ...options.success,
        icon: options.success.icon ?? ProcessProgress.defaultIcons.success,
      },
    });

    this.#steps.push(step);

    return this;
  }

  toString(): string {
    const relevantSteps = this.getRelevantSteps();
    return relevantSteps.map(step => step.toString()).join('\n');
  }

  private getRelevantSteps(): ProcessStep[] {
    return this.#steps.filter((step, index) => {
      const previousStep = this.#steps[index - 1];

      if (!previousStep) {
        return true;
      }

      return step.done || previousStep.done;
    })
  }
}

export type Status = 'running' | 'error' | 'warning' | 'success';

export interface AddStepOptions {
  title: string;
  success: StepMessage;
  running: StepMessage;
  warning?: StepMessage | undefined;
  error: StepMessage;
  done: boolean;
  errored: boolean;
  warned?: boolean | undefined;
}

import { ProcessStep, ProcessStepOptions } from './ProcessStep';

export class ProcessProgress {
  readonly #steps: ProcessStep[] = [];

  addStep(options: ProcessStep | ProcessStepOptions): this {
    const step = options instanceof ProcessStep
      ? options
      : new ProcessStep(options);

    this.#steps.push(step);
    return this;
  }

  toString(): string {
    const relevantSteps = this.getRelevantSteps();
    return relevantSteps.map(step => step.toString()).join('\n');
  }

  private getRelevantSteps(): ProcessStep[] {
    return this.#steps.filter((step, index) => {
      const previousStep = this.#steps.at(index - 1);

      if (!previousStep) {
        return true;
      }

      return step.done || previousStep.done;
    })
  }
}

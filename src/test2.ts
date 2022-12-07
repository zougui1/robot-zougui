import { ProcessState, ProcessProgress } from './utils';

(async () => {
  console.group('State');
  const state = new ProcessState()
    .addStep('downloadingWebpage', {
      title: 'Downloading webpage',
      success: { content: 'Downloaded' },
      running: { content: 'Downloading...' },
    })
    .addStep('downloadingFile', {
      title: 'Downloading file',
      success: { content: 'Downloaded' },
      running: { content: 'Downloading...' },
    })
    .addStep('parsingFile', {
      title: 'Parsing file',
      success: { content: 'Parsed' },
      running: { content: 'Parsing...' },
    })
    .addStep('countingWords', {
      title: 'Counting words',
      success: { content: 'Counted' },
      running: { content: 'Counting...' },
    });

  console.log(state.getProgressString());

  state.finish('downloadingFile')
  console.log();
  console.log(state.getProgressString());

  state.error('parsingFile', 'The file is not a text or a document');
  console.log();
  console.log(state.getProgressString());

  console.groupEnd();
})();

(async () => {
  console.group('Progress');
  const progress = new ProcessProgress()
    .addStep({
      title: 'Downloading webpage',
      success: { content: 'Downloaded' },
      running: { content: 'Downloading...' },
      error: { content: 'An error occured' },
      done: false,
      errored: false,
    })
    .addStep({
      title: 'Downloading file',
      success: { content: 'Downloaded' },
      running: { content: 'Downloading...' },
      error: { content: 'An error occured' },
      done: false,
      errored: false,
    })
    .addStep({
      title: 'Parsing file',
      success: { content: 'Parsed' },
      running: { content: 'Parsing...' },
      error: { content: 'An error occured' },
      done: false,
      errored: false,
    })
    .addStep({
      title: 'Counting words',
      success: { content: 'Counted' },
      running: { content: 'Counting...' },
      error: { content: 'An error occured' },
      done: false,
      errored: false,
    });

  console.log(progress.toString());
  console.groupEnd();
})();

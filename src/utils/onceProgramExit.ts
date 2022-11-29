const shutdownSignals: ExitSignal[] = [
  'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
  'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM',
];

/**
 * @returns a function to cleanup the listener
 */
export const onceProgramExit = (listener: (signal: ExitSignal) => void): (() => void) => {
  const exitHandlers: ExitHandlerItem[] = shutdownSignals.map(signal => {
    return {
      signal,
      listener: () => listener(signal),
    };
  });

  for (const { signal, listener } of exitHandlers) {
    process.once(signal, listener);
  }

  return () => {
    for (const { signal, listener } of exitHandlers) {
      process.off(signal, listener);
    }
  }
}

type ExitHandlerItem = {
  signal: ExitSignal;
  listener: ExitHandler;
}

export type ExitHandler = (signal: ExitSignal) => void
export type ExitSignal = (NodeJS.Signals | 'exit' | 'beforeExit');

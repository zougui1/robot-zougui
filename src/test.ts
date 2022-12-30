import { Spawn } from '@zougui/common.child-process';

const sync = async (options: SyncOptions): Promise<void> => {
  const { user, address, dir: remoteDir } = options.remote;
  const remote = `${user}@${address}:${remoteDir}`;

  const srcAndDest = options.strategy === SyncStrategy.LocalToRemote
    ? [options.local.dir, remote]
    : [remote, options.local.dir];

  const proc = new Spawn('rsync', {
    args: srcAndDest,
    flags: {
      verbose: true,
      recursive: true,
      links: true,
      times: true,
      delete: true,
      'no-perms': true,
      'copy-dirlinks': true,
    },
  });

  await proc.exec();
}

interface SyncRemote {
  user: string;
  address: string;
  dir: string;
}

interface SyncLocal {
  dir: string;
}

interface SyncOptions {
  strategy: SyncStrategy;
  remote: SyncRemote;
  local: SyncLocal;
}

enum SyncStrategy {
  LocalToRemote = 'LocalToRemote',
  RemoteToLocal = 'RemoteToLocal',
}

(async () => {
  await sync({
    strategy: SyncStrategy.RemoteToLocal,
    local: {
      dir: '/mnt/Manjaro_Data/zougui/Audio/temp',
    },
    remote: {
      user: 'zougui',
      address: '192.168.10.166',
      dir: '/home/zougui/Workspace/Sync/test',
    },
  });
})();

import PrettyError from 'pretty-error';

const rePackageNamespace = /^\[.+\]\/\[(.+)\]\/\[.+\]/i;

const pe = new PrettyError();
pe.start();
pe.skipNodeFiles();
// replaces verbose namespace of a package name to have only its name + version
// regexes are also supported, but aren't in the type definition
pe.alias(rePackageNamespace as any, '$1');
// alias current dir
pe.alias(__dirname, 'discord-notion-trackers');
// skip node internals
pe.skip((e: any) => {
  const path = String(e?.dir || e?.path || e?.addr);
  return path.startsWith('node:internal');
});

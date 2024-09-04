const ifStaged = fn => stagedFiles => stagedFiles.length === 0 ? [] : fn(stagedFiles);
const withArgs = (cmd, ...args) => `${cmd} ${args.flat().join(' ')}`;

module.exports = {
  './(src|scripts)/**/*.ts': ifStaged(stagedFiles => [
    withArgs('prettier', '--write', stagedFiles),
    withArgs('eslint', '--fix', stagedFiles),
    withArgs('tsc', '--noEmit'),
  ]),
  './src/address-book/*/tokens/tokens.ts': ifStaged(stagedFiles => {
    const chains = stagedFiles.map(file => file.split('/')[2]).filter(v => !!v);
    if (!chains.length) {
      throw new Error('Matched files do not match expected path structure');
    }
    return [withArgs('ts-node', '--transpileOnly', './scripts/checkDuplicates.ts', chains)];
  }),
};
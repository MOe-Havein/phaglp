module.exports = {
  hooks: {
    readPackage(pkg) {
      const { name, version } = pkg;
      const allowlist = [
        '@prisma/client:6.19.3',
        '@prisma/engines:6.19.3',
        'esbuild:0.28.1',
        'prisma:6.19.3',
        'sharp:0.34.5',
        'unrs-resolver:1.12.2',
      ];
      const key = `${name}:${version}`;
      if (allowlist.includes(key)) {
        pkg.buildScript = false;
        pkg.scripts = pkg.scripts || {};
        delete pkg.scripts.prepare;
        delete pkg.scripts.postinstall;
        delete pkg.scripts.preinstall;
      }
      return pkg;
    },
  },
};

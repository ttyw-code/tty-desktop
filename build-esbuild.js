// build-esbuild.js
// Simple esbuild script to resolve `src/` imports to the source files
// and emit ES module outputs under out/src/* so Electron can run them.

import { build } from 'esbuild';
import path from 'path';
import fs from 'fs';
import postcss from 'esbuild-postcss';

const projectRoot = process.cwd();

// Helper plugin to resolve `src/...` imports to the source files
const aliasPlugin = {
  name: 'alias-src',
  setup(build) {
    // Resolve imports that start with src/ or @/
    build.onResolve({ filter: /^(src\/|@\/)/ }, args => {
      // map src/... or @/... -> absolute path in project src/
      const spec = args.path.replace(/^@\//, 'src/');
      let abs = path.join(projectRoot, spec);

      // If the import ends with .js but a corresponding .ts exists, prefer .ts
      if (abs.endsWith('.js')) {
        const tsPath = abs.slice(0, -3) + '.ts';
        if (fs.existsSync(tsPath)) {
          abs = tsPath;
        }
      }

      return { path: abs };
    });

    // Ensure .ts resolves correctly
    build.onResolve({ filter: /^\.\// }, args => {
      // Let esbuild do normal resolution for relative paths
      return null;
    });
  }
};

(async () => {
  try {
    // Ensure out dirs exist
    const outDir = path.join(projectRoot, 'out', 'src');
    fs.mkdirSync(outDir, { recursive: true });

    // Ensure renderer out dir exists
    const rendererOutDir = path.join(projectRoot, 'out', 'renderer');
    fs.mkdirSync(rendererOutDir, { recursive: true });

    await build({
      entryPoints: ['src/main/main.ts'],
      bundle: true,
      outfile: 'out/src/main/main.js',
      platform: 'node',
      format: 'esm',
      sourcemap: true,
      plugins: [aliasPlugin],
      tsconfig: 'tsconfig.json',
      external: ['electron', 'electron/main'],
      logLevel: 'info'
    });

    // Build Renderer Process
    await build({
      entryPoints: ['src/renderer/src/main.tsx'],
      bundle: true,
      outfile: 'out/renderer/main.js',
      platform: 'browser',
      format: 'esm',
      sourcemap: true,
      plugins: [aliasPlugin, postcss()],
      tsconfig: 'tsconfig.json',
      logLevel: 'info'
    });

    console.log('esbuild: build complete');
  } catch (e) {
    console.error('esbuild: build failed', e);
    process.exit(1);
  }
})();

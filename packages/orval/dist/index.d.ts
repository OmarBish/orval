import { ConfigExternal, OptionsExport, GlobalOptions } from '@orval/core';
export { Options } from '@orval/core';

/**
 * Type helper to make it easier to use orval.config.ts
 * accepts a direct {@link ConfigExternal} object.
 */
declare function defineConfig(options: ConfigExternal): ConfigExternal;

declare const generate: (optionsExport?: string | OptionsExport, workspace?: string, options?: GlobalOptions) => Promise<void>;

export { generate as default, defineConfig, generate };

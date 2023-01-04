import { compile } from 'tomejs/compiler';
import type { Plugin } from 'vite';
import { getComponents, getPages } from './utils.js';
import type { UserOptions } from './types.js';

export default function vitePluginTome(options: UserOptions): Plugin {

  return {
    name: 'vite-plugin-tome',

    resolveId(id) {
      if (id === '~tome-meta') {
        return `\0${id}`;
      }
    },

    load(id) {
      if (id === `\0~tome-meta`) {
        return getPages(options.pages) +
          getComponents(options.components, 'components') +
          getComponents(options.store, 'store');
      }
    },

    transform(src: string, id: string) {
      const fileRegex = /\.tome$/;
      if (fileRegex.test(id)) {
        return {
          code: compile(src),
          map: null, // provide source map if available
        }
      }
    }
  };
}

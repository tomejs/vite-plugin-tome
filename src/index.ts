import { compile } from 'tomejs/compiler';

export default function vitePluginTome() {
  return {
    name: 'vite-plugin-tome',

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

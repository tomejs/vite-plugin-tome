import fg from 'fast-glob';

function getURLAndNameForPage(page: string, dest = 'url') {
  const parts = page.split('/').slice(1);
  const dynamicFileRegex = /\[.*\]/;

  if(parts.length === 1) {
    let name = `${parts[0].replace('.tome', '')}`;
    return { name, url: `/${name === 'index' ? '' : name}` };
  } else {
    let url = '';
    let name = '';
    let file = parts.pop()?.replace('.tome', '');
    parts.forEach((part) => {
      url += `/${part === 'index' ? '/' : part}`;
      name += `${part}_`;
    });
    if(file && dynamicFileRegex.test(file)) {
      if(dest === 'url') {
        file = file.replace('[', ':').replace(']', '');
      } else {
        file = file.replace('[', '$').replace(']', '');
      }
    }
    url = `${url}${file && file !== 'index' ? ('/' + file) : ''}`;
    name = `${name}_${file || 'index'}`;
    return { url, name };
  }
}

export function getPages(sourcePath: string) {
  const pages = fg.sync(`${sourcePath}/**/*.tome`);
  let imports = '';
  let result = 'export const pages = [\n';
  pages.forEach((page) => {
    const path = page.replace(sourcePath, '');
    imports += `import ${getURLAndNameForPage(path, 'name').name} from './${page}';\n`;
    result += `{ path: '${getURLAndNameForPage(path).url}', component: ${getURLAndNameForPage(path, 'name').name} },\n`;
  });
  result += '];\n';
  return imports + result;
}

export function getComponents(sourcePath: string, type = 'components') {
  const components = fg.sync(`${sourcePath}/**/*.tome`);
  let imports = '';
  let result = `export const ${type} = {\n`;

  components.forEach((component) => {
    const path = component.replace(sourcePath, '');
    const name = path.replace('.tome', '').replace('/', '');
    imports += `import ${name} from './${component}';\n`;
    result += `${name},\n`;
  });
  result += '};\n';
  return imports + result;
}

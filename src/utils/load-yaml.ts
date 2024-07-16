import { readFileSync } from 'node:fs';

import { render } from 'ejs';
import { load } from 'js-yaml';

function processYAMLExpressions(yaml: string, context: Record<string, any>) {
  const processed = render(yaml, context);
  return load(processed);
}

export function loadYAML<T>(path: string, context: Record<string, any> = {}, encoding: BufferEncoding = 'utf8') {
  const fileContent = readFileSync(path, encoding);
  return processYAMLExpressions(fileContent, context) as T;
}

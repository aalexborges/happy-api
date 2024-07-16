import { readFileSync } from 'node:fs';

import { loadYAML } from './load-yaml';

jest.mock('node:fs');

describe('loadYAML', () => {
  const content = `
  database:
    url: <%- Env.DATABASE_URL.replace('?', '_development?') %>
  `;

  it('processes YAML and expressions in YML correctly', () => {
    (readFileSync as jest.Mock).mockReturnValueOnce(content);

    const result = loadYAML('./test.yaml', {
      Env: { DATABASE_URL: 'postgresql://happy:happy@postgres:5432/happy?encoding=utf8&pool=5&timeout=5000' },
    });

    expect(result).toEqual({
      database: {
        url: 'postgresql://happy:happy@postgres:5432/happy_development?encoding=utf8&pool=5&timeout=5000',
      },
    });
  });
});

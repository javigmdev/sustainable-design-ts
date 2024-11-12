import { TemplateEngine } from '../../core/03-kata-template-engine/templateEngine';

describe('The Template Engine', () => {
  it('parses template without variables', () => {
    const templateText = 'This is a template with zero variables';
    const variables = new Map<string, string>();
    const parsedTemplate = new TemplateEngine(templateText, variables).parse().text;
    expect(parsedTemplate).toBe('This is a template with zero variables');
  });

  it('parses template with one variable', () => {
    const templateText = 'This is a template with a ${variable}';
    const variables = new Map<string, string>();
    variables.set('variable', 'foo');
    const parsedTemplate = new TemplateEngine(templateText, variables).parse().text;
    expect(parsedTemplate).toBe('This is a template with a foo');
  });

  it('parses template with multiple variables', () => {
    const templateText = 'This is a template with a ${variable} and ${anotherVariable}';
    const variables = new Map<string, string>();
    variables.set('variable', 'foo');
    variables.set('anotherVariable', 'bar');
    const parsedTemplate = new TemplateEngine(templateText, variables).parse().text;
    expect(parsedTemplate).toBe('This is a template with a foo and bar');
  });

  it('parses template with repeated variables', () => {
    const templateText = 'This is a template with a ${variable} and ${variable}';
    const variables = new Map<string, string>();
    variables.set('variable', 'foo');
    const parsedTemplate = new TemplateEngine(templateText, variables).parse().text;
    expect(parsedTemplate).toBe('This is a template with a foo and foo');
  });

  it('warns about variables not being found', () => {
    const templateText = '${user}';
    const variables = new Map<string, string>();
    variables.set('user', 'john');
    variables.set('age', '35');
    const aDate = new Date().toString();
    variables.set('date', aDate);

    const parsedTemplate = new TemplateEngine(templateText, variables).parse();
    expect(parsedTemplate.text).toBe('john');
    expect(parsedTemplate.containsWarnings()).toBe(true);
    expect(parsedTemplate.warnings[0].message).toBe('Variable age not found in template');
    expect(parsedTemplate.warnings[1].message).toBe('Variable date not found in template');
  });

  it('warns about no replaced variables', () => {
    const templateText = '${user} ${age}';
    const variables = new Map<string, string>();

    const parsedTemplate = new TemplateEngine(templateText, variables).parse();
    expect(parsedTemplate.text).toBe('${user} ${age}');
    expect(parsedTemplate.containsWarnings()).toBe(true);
    expect(parsedTemplate.warnings[0].message).toBe('Variable user could not be replaced');
    expect(parsedTemplate.warnings[1].message).toBe('Variable age could not be replaced');
  });

  it('warns about non defined variables', () => {
    const templateText = 'text';
    const variables = null;

    const parsedTemplate = new TemplateEngine(templateText, variables).parse();

    expect(parsedTemplate.text).toBe('text');
    expect(parsedTemplate.containsWarnings()).toBe(true);
    expect(parsedTemplate.warnings[0].message).toBe('Variables is not defined');
  });

  it('warns about non defined text', () => {
    const templateText = null;
    const variables = new Map();

    const parsedTemplate = new TemplateEngine(templateText, variables).parse();

    expect(parsedTemplate.text).toBe('');
    expect(parsedTemplate.containsWarnings()).toBe(true);
    expect(parsedTemplate.warnings[0].message).toBe('Text is not defined');
  });
});

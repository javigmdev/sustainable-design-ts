import { ParsedTemplate } from './parsedTemplate';
import { TemplateWarning } from './templateWarning';

export class TemplateEngine {
  constructor(
    private readonly templateText: string,
    private readonly variables: Map<string, string>
  ) {}

  parse() {
    if (this.variables == null) {
      return this.templateWithWarningAboutVariablesNonDefined();
    }
    const parsedTemplate = this.templateWithReplacedVariables();
    return this.addWarningAboutNonReplacedVariables(parsedTemplate);
  }

  private templateWithWarningAboutVariablesNonDefined() {
    return ParsedTemplate.create(this.templateText, [new TemplateWarning('Variables is not defined')]);
  }

  private templateWithReplacedVariables() {
    let parsedText = this.templateText;
    const warnings: TemplateWarning[] = [];
    this.variables.forEach((value, key) => {
      parsedText = parsedText.replaceAll(this.formTemplateVariable(key), value);
      if (!parsedText.includes(value)) {
        warnings.push(new TemplateWarning(`Variable ${key} not found in template`));
      }
    });
    return ParsedTemplate.create(parsedText, warnings);
  }

  private formTemplateVariable(key: string): string | RegExp {
    return `\$\{${key}\}`;
  }

  private addWarningAboutNonReplacedVariables(parsedTemplate: ParsedTemplate) {
    const regex = /\$\{[a-zA-Z0-9-]+\}/g;
    const matches = parsedTemplate.text.match(regex);
    if (!matches) {
      return parsedTemplate;
    }
    const warnings: TemplateWarning[] = [];
    matches.forEach((match) => {
      const variableName = match.substring(2, match.length - 1);
      warnings.push(new TemplateWarning(`Variable ${variableName} could not be replaced`));
    });
    return parsedTemplate.addWarnings(warnings);
  }
}

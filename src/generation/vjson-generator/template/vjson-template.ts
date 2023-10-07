import path from 'path';
import { renderFile, type Data } from 'template-file';

export type VJsonTemplateData = Data;
export class VJsonTemplate<Params extends VJsonTemplateData> {
  private templatePath: string;

  constructor(templateName: string) {
    this.templatePath = path.join(__dirname, '../../../../templates/', templateName);
  }

  async getContents(data: Params): Promise<string> {
    return JSON.stringify(JSON.parse(await renderFile(this.templatePath, data)), null, 2);
  }
}

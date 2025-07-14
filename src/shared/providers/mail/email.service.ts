import { Injectable } from '@nestjs/common';
import handlebars from 'handlebars';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Resend } from 'resend';

import env from '@config/env';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(env().mail.resend);
  }

  async send(
    to: string,
    subject: string,
    templateName: string,
    context: Record<string, unknown>,
  ): Promise<void> {
    const html = await this.compileTemplate(templateName, context);

    await this.resend.emails.send({
      from: 'Pro schedule <noreply@geeknizado.com.br>', //TODO - Change domain
      to,
      subject,
      html,
    });
  }

  private async compileTemplate(
    templateName: string,
    context: Record<string, unknown>,
  ): Promise<string> {
    const filePath = join(
      process.cwd(),
      'src',
      'shared',
      'providers',
      'mail',
      'templates',
      `${templateName}.hbs`,
    );
    const templateContent = await readFile(filePath, 'utf-8');
    const template = handlebars.compile(templateContent);
    return template(context);
  }
}

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Attachment, simpleParser } from 'mailparser';
import { AxiosError } from 'axios';
import * as cheerio from 'cheerio';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class ChallengeService {
  constructor(private readonly httpService: HttpService) {
  }

  async getJsonFromEmail(urlOrPath: string): Promise<any> {
    const logger = new Logger('ChallengeService');

    let file: any;
    if (urlOrPath.startsWith('https')) {
      file = await this.getUrl(urlOrPath);
    } else {
      file = await this.getFileContents(urlOrPath);
    }

    const mail = await simpleParser(file);
    /**
     * Get json from attachments
     */
    const fromAttachment = this.getJsonFromAttachment(mail.attachments);
    if (fromAttachment) {
      logger.debug('fromAttachment');
      return fromAttachment;
    }
    /**
     * Get link json in the email body
     */
    const links = await this.getLinksFromHtml(mail.html);
    const fromBody = await this.getJsonFromLinks(links);
    if (fromBody) {
      logger.debug('fromBody');
      return fromBody;
    }
    /**
     * Get page json from the link in the body of the email
     */
    const fromPage = await this.getJsonFromPage(links);
    if (fromPage) {
      logger.debug('fromPage');
      return fromPage;
    }
    return 'No JSON found in email';
  }

  getFileContents(pathFile: string): Promise<string> {
    const filePath = path.join(__dirname, '..', '..', 'assets', pathFile);
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  async getUrl(url: string): Promise<any> {
    try {
      const res = await firstValueFrom(this.httpService.get(url));
      return res.data;
    } catch (e) {
      if (e instanceof AxiosError) {
        throw new BadRequestException({
          message: 'Error getting from link',
          link: url,
          status: e.response.status,
          statusText: e.response.statusText,
        });
      } else {
        throw e;
      }
    }
  }

  getJsonFromAttachment(attachments: Attachment[]): any | null {
    for (const attachment of attachments) {
      if (attachment.filename.endsWith('.json')) {
        return JSON.parse(attachment.content.toString('utf-8'));
      }
    }
    return null;
  }

  async getJsonFromLinks(links: string[]): Promise<any | null> {
    for (const link of links) {
      if (link.includes('.json')) {
        return this.getUrl(link);
      }
    }
    return null;
  }

  async getLinksFromHtml(
    html: string | false,
    host?: string,
  ): Promise<string[]> {
    if (html) {
      /**
       * Get the contents of href
       */
      const $ = cheerio.load(html);
      const hrefContents: string[] = [];
      $('a[href]').each((index, element) => {
        const hrefValue = $(element).attr('href');
        hrefContents.push(hrefValue);
      });
      /**
       * Get links that may not be inside a href tag
       */
      const regex = /(?<!href=")(https?:\/\/\S+?)(?:"|<|(?=\s|<\/))/g;
      const linksNoHref = html.match(regex);
      /**
       * clean and filter repeated links
       */
      let links = [...hrefContents, ...linksNoHref].map((match) => {
        if (match.endsWith('<')) {
          return match.slice(0, -1);
        }
        return match;
      });
      links = links.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
      /**
       * href contents that do not have an url are added by the host
       */
      if (host) {
        const trimHost = host.endsWith('/') ? host.slice(0, -1) : host;
        links = links.map((value) =>
          value.startsWith('http')
            ? value
            : trimHost + '/' + (value.startsWith('/') ? value.slice(1) : value),
        );
      }
      return links.filter((value) => value.startsWith('https://'));
    }
    return [];
  }

  async getJsonFromPage(links: string[]): Promise<any | null> {
    for (const link of links) {
      let res: any;
      try {
        res = await this.getUrl(link);
      } catch (e) {
        continue;
      }
      const url = new URL(link);
      const links = await this.getLinksFromHtml(res, 'https://' + url.host);
      const json = await this.getJsonFromLinks(links);
      if (json) {
        return json;
      }
    }
    return null;
  }
}

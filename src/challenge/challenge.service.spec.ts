import { Test, TestingModule } from '@nestjs/testing';
import { ChallengeService } from './challenge.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('ChallengeService', () => {
  let service: ChallengeService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChallengeService],
      imports: [HttpModule],
    }).compile();

    service = module.get<ChallengeService>(ChallengeService);
    httpService = module.get<HttpService>(HttpService);

    httpService.get = jest.fn().mockImplementation(() =>
      of({
        status: 200,
        data: {
          title: 'Sample title',
          content: 'Sample content',
        },
      }),
    );
  });

  it('getLinksFromHtml - no host', async (): Promise<void> => {
    const emailContent = `
      <a href="https://firebasestorage.googleapis.com/v0/b/backend-test-eaefe.appspot.com/o/sample1.json?alt=media&token=f5412ed0-24b1-4895-be56-a67e903e2159">Link to firebase JSON</a>
      <a href="https://filesamples.com/samples/code/json/sample1.json">Link to JSON</a>
      <a href="https://anotherexample.com/file.pdf">Link to PDF</a>
      <a href="https://invalidlink.com">Link to page</a>
      <a href="file.pdf">file link</a>
      <a href="sample.json">json link</a>
      Link to other: https://example.com/other
      Invalid link to other: http://example.com/invalid
      <p>https://example.com/paragraph</p>
    `;
    const testLinks = [
      'https://firebasestorage.googleapis.com/v0/b/backend-test-eaefe.appspot.com/o/sample1.json?alt=media&token=f5412ed0-24b1-4895-be56-a67e903e2159',
      'https://filesamples.com/samples/code/json/sample1.json',
      'https://anotherexample.com/file.pdf',
      'https://invalidlink.com',
      'https://example.com/other',
      'https://example.com/paragraph',
    ];
    await expect(service.getLinksFromHtml(emailContent)).resolves.toEqual(
      testLinks,
    );
  });

  it('getLinksFromHtml - host', async (): Promise<void> => {
    const emailContent = `
      <a href="https://firebasestorage.googleapis.com/v0/b/backend-test-eaefe.appspot.com/o/sample1.json?alt=media&token=f5412ed0-24b1-4895-be56-a67e903e2159">Link to firebase JSON</a>
      <a href="https://filesamples.com/samples/code/json/sample1.json">Link to JSON</a>
      <a href="https://anotherexample.com/file.pdf">Link to PDF</a>
      <a href="https://invalidlink.com">Link to page</a>
      <a href="/file.pdf">file link</a>
      <a href="sample.json">json link</a>
      Link to other: https://example.com/other
      Invalid link: http://example.com/invalid
    `;
    const testLinks = [
      'https://firebasestorage.googleapis.com/v0/b/backend-test-eaefe.appspot.com/o/sample1.json?alt=media&token=f5412ed0-24b1-4895-be56-a67e903e2159',
      'https://filesamples.com/samples/code/json/sample1.json',
      'https://anotherexample.com/file.pdf',
      'https://invalidlink.com',
      'https://example.com/file.pdf',
      'https://example.com/sample.json',
      'https://example.com/other',
    ];
    await expect(
      service.getLinksFromHtml(emailContent, 'https://example.com'),
    ).resolves.toEqual(testLinks);
  });

  it('getJsonFromLinks - with params', async (): Promise<void> => {
    const testLinks = [
      'https://anotherexample.com/file.pdf',
      'https://invalidlink.com',
      'https://example.com/other',
      'https://firebasestorage.googleapis.com/v0/b/backend-test-eaefe.appspot.com/o/sample1.json?alt=media&token=f5412ed0-24b1-4895-be56-a67e903e2159',
    ];
    await expect(service.getJsonFromLinks(testLinks)).resolves.not.toEqual(
      null,
    );
  });

  it('getJsonFromLinks - with out params', async (): Promise<void> => {
    const testLinks = [
      'https://anotherexample.com/file.pdf',
      'https://invalidlink.com',
      'https://example.com/other',
      'https://filesamples.com/samples/code/json/sample1.json',
    ];
    await expect(service.getJsonFromLinks(testLinks)).resolves.not.toEqual(
      null,
    );
  });

  it('getFileContents', async (): Promise<void> => {
    await expect(
      service.getFileContents('emails/attachment.eml'),
    ).resolves.not.toThrow();
  });
});

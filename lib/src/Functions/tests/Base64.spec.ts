import { Base64 } from '../Base64';

describe('Base64', () => {
  const file = new File(['foo'], 'foo.txt', { type: 'text/plain' });

  it('should encode a file as base64', async () => {
    const encodedFile = await Base64.EncodAsBase64(file);
    expect(encodedFile).toBeDefined();
  });

  it('should decode a file from base64', async () => {
    const encodedFile = await Base64.EncodAsBase64(file);
    const decodedFile = Base64.DecodeFromBase64(encodedFile, 'foo.txt');
    expect(decodedFile.type).toEqual(file.type);
  });

});

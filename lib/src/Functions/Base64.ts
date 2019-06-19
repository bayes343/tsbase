import { Errors } from '../Errors';

type Base64Encoding = string | ArrayBuffer | null;

export class Base64 {

  public static async EncodAsBase64(fileToEncode: File): Promise<Base64Encoding> {
    const reader = new FileReader();
    return await new Promise<Base64Encoding>((resolve) => {
      reader.readAsDataURL(fileToEncode);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = () => {
        throw new Error(Errors.Base64EncodingFailed);
      };
    });
  }

  public static DecodeFromBase64(dataurl: string, filename: string): File {
    try {
      const arr = dataurl.split(',') as any,
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]);

      let n = bstr.length;
      const u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new File([u8arr], filename, { type: mime });
    } catch (error) {
      throw new Error(Errors.Base64DecodingFailed);
    }
  }

}

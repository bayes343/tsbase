import { Errors } from '../Errors';

export class Base64 {

  /**
   * Accepts a File instance and asynchronously returns the Base64 encoded string equivalent.
   * @param fileToEncode
   */
  public static async EncodeAsBase64(fileToEncode: File): Promise<string> {
    const reader = new FileReader();
    return await new Promise<string>((resolve) => {
      reader.readAsDataURL(fileToEncode);
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        throw new Error(Errors.Base64EncodingFailed);
      };
    });
  }

  /**
   * Accepts a Base64 encoded string and file name, and returns the File instance equivalent.
   * @param base64
   * @param filename
   */
  public static DecodeFromBase64(base64: string, filename: string): File {
    try {
      const arr = base64.split(',') as any,
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

export interface ISignatureService {
  computeSignature(
    apiKey: string,
    secretKey: string,
    accessToken: string,
    timestamp: string,
  ): string;
  validateSignature(
    signature: string,
    timestamp: string,
    accessToken: string,
    tolerance: number,
  ): boolean;
}

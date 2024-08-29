export interface UserSignature {
  SignatureID?: number;
  UserID: number;
  SignatureImage: Blob | string;
  SignatureDate?: Date;
}

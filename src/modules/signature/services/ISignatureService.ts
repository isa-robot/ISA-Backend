import IDocument from "@modules/signature/interfaces/IDocument";
import {IDocumentSignerResponse} from "@modules/signature/interfaces/dtos/ISignatureResponsesDTO";
import IDocumentSignHook from "@modules/signature/interfaces/IDocumentSignHook";
import ICustomDocumentSigner from "@modules/signature/interfaces/ICustomDocumentSigner";

export default interface ISignatureService {
  showDocuments(): Promise<IDocument[]>;
  showDocumentByUser(id: string): Promise<ICustomDocumentSigner | undefined>;
  generateSignature(userId: string): Promise<IDocumentSignerResponse | undefined>;
  sendSignatureSolicitation(by: { userId?: string, requestSignatureKey?: string}): Promise<any>;
  saveSignature(documentSign: IDocumentSignHook[]): Promise<boolean>;
}

import {Request, Response} from "express";

export default interface ISignatureController {
  showDocuments(req: Request, res: Response): Promise<Response>;
  genDocumentSigner(req: Request, res: Response): Promise<Response>;
  sendSignatureSolicitation(req: Request, res: Response): Promise<Response>;
  showDocumentByUser(req: Request, res: Response): Promise<Response>;
  createDoc(req: Request, res: Response): Promise<Response>;
}

import {autoInjectable, delay, inject} from "tsyringe";
import SignatureService from "@modules/signature/services/SignatureService";
import ISignatureService from "@modules/signature/services/ISignatureService";
import {Request, Response} from "express";
import ISignatureController from "@modules/signature/api/controllers/ISignatureController";
import WebhooksEventsEnum from "@modules/signature/enums/WebhooksEventsEnum";

@autoInjectable()
class SignatureController implements ISignatureController {
  constructor(@inject(SignatureService)
              private signatureService?: ISignatureService) {}

  async createDoc(req: Request, res: Response): Promise<Response> {
    try {
      const { docType } = req.body;
      const result = await this.signatureService?.crateDocument(docType);
      return res.json(result);
    } catch (e) {
      console.info(e);
      return res.status(500).json(e);
    }
  }

  async receiveSign(req: Request, res: Response): Promise<Response> {
    try {
      if(req.body.event.name === WebhooksEventsEnum.SIGN){
        await this.signatureService?.saveSignature(req.body.document.signers);
        return res.status(200).json(req.body);
      } else {
        return res.status(200).json();
      }
    } catch (e) {
      return res.status(500).json({})
    }
  }

  async showDocuments(req: Request, res: Response): Promise<Response> {
    try {
      const result = await this.signatureService?.showDocuments();
      return res.status(200).json(result);
    } catch (e) {
      return res.status(e.status || 500).json(e.message || e)
    }
  }

  async showDocumentByUser(req: Request, res: Response) : Promise<Response> {
    try {
      // @ts-ignore
      const userId = req.user.id;
      const result = await this.signatureService?.showDocumentByUser(userId);
      return res.status(200).json(result);
    } catch (e) {
      return res.status(e.status || 500).json(e.message || e);
    }
  }

  async genDocumentSigner(req: Request, res: Response): Promise<Response> {
    try {
      const { docType } = req.body;
      // @ts-ignore
      const userId = req.user.id;
      const result = await this.signatureService?.generateSignature(userId, docType);
      return res.status(200).json(result);
    } catch (e) {
      return res.status(e.status || 500).json(e.message || e)
    }
  }

  async sendSignatureSolicitation(req: Request, res: Response): Promise<Response> {
    try {
      // @ts-ignore
      const userId = req.user.id;
      const result = await this.signatureService?.sendSignatureSolicitation({userId});
      return res.status(200).json(result);
    } catch (e) {
      return res.status(e.status || 500).json(e.message || e)
    }
  }
}
export default new SignatureController();

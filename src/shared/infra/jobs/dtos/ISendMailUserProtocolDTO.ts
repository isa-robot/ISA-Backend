import User from "@users/infra/typeorm/entities/User";

interface IContactMail {
  name: string;
  address: string;
}

export default interface ISendMailUserProtocolDTO {
  to: IContactMail;
  from: IContactMail;
  data: {
    name: string;
    protocol: string;
    attended: User;
    symptoms: string[];
    establishment: string;
    responsible?: User[];
  };
}
import csvtojson from "csvtojson";

import IRegisterFromCsvService from "@users/csvRegister/Interfaces/services/IRegisterFromCsvService";
import IUserRepresentation from "@users/csvRegister/Interfaces/user/IUserRepresentation";
import * as Stream from "stream";
import KeycloakAdmin from '@shared/keycloak/keycloak-admin'
import AppError from "@errors/AppError";
import json2csv from 'json-2-csv'
import * as fs from "fs";
import {string} from "yup";

export default class CsvRegisterService implements IRegisterFromCsvService {

  private uploadPath: string;
  private csvName : string;

  constructor() {
    this.uploadPath = __dirname + '/..' + '/api/uploads'
    this.csvName = '/usuariosNaoRegistrados.csv'
  }

  csvToJson(fileStream: Stream.Readable): PromiseLike<IUserRepresentation[]> {
    return csvtojson().fromStream(fileStream)
      .then((users: IUserRepresentation[]) => users)
  }

  async registerUsers(users: IUserRepresentation[]) {
    this.verifyDuplications(users)

    const usersWithError = []
    for (const user of users) {
      try {
        await KeycloakAdmin.createUser(user)
      }catch(e) {
        if(e.statusCode == 400) {
          throw new AppError("há campos inválidos", e.statusCode)
          break;
        }else{
          usersWithError.push(user)
        }
      }
    }
    return usersWithError ? usersWithError : "";
  }

  private verifyDuplications(users: IUserRepresentation[]) {
    const uniqueEmail = new Set();
    const uniqueUsername = new Set();

    const isEmailDuplicated = users.some(user => uniqueEmail.size === uniqueEmail.add(user.email).size)

    if(isEmailDuplicated) {
      throw new AppError("emails duplicados", 409)
    }

    const isUsernameDuplicated = users.some(user => uniqueUsername.size === uniqueUsername.add(user.username).size)

    if(isUsernameDuplicated) {
      throw new AppError("nomes de usuário duplicados", 409)
    }

    return false;
  }
}

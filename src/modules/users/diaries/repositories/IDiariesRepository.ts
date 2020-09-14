import ICreateUserDiaryDTO from "../dtos/ICreateUserDiaryDTO";
import Diary from "../infra/typeorm/entities/Diary";

export default interface IDiariesRepository {
  create(data: ICreateUserDiaryDTO): Promise<Diary>;
  save(diary: Diary): Promise<Diary>;
  findById(id: string): Promise<Diary | undefined>;
  findAllByUser(idUser: string): Promise<Diary[]>;
  findByDateByUser(date: string, userId: string): Promise<Diary | undefined>;
  findByRangeDateByUser(date: Date, userId: string): Promise<Diary | undefined>;
  findInDateByUser(date: string, userId: string): Promise<Diary | undefined>;
  findBySymptomByUser(
    symptom: string,
    userId: string
  ): Promise<Diary | undefined>;
  findLastByUser(userId: string): Promise<Diary | undefined>;

}

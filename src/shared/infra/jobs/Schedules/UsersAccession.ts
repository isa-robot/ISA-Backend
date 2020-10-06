import {container} from "tsyringe";
import IEstablishmentsRepository from "@establishments/repositories/IEstablishmentsRepository";
import {subDays} from "date-fns";
import IDiariesRepository from "@users/diaries/repositories/IDiariesRepository";
import IStatisticsRepository from "@establishments/statistics/repositories/IStatisticsRepository";
import IStatisticTypesRepository
  from "@establishments/statistics/statistic-types/repositories/IStatisticTypesRepository";
import AppError from "@errors/AppError";
import KeycloakAdmin from "@shared/keycloak/keycloak-admin";

export default async function UsersAccession() {
  const date = subDays(new Date(), 1);
  const establishmentRepository = container.resolve<IEstablishmentsRepository>(
    "EstablishmentsRepository"
  );
  const diariesRepository = container.resolve<IDiariesRepository>(
    "DiariesRepository"
  );
  const statisticsRepository = container.resolve<IStatisticsRepository>(
    "StatisticsRepository"
  );
  const statisticTypesRepository = container.resolve<IStatisticTypesRepository>(
    "StatisticTypesRepository"
  );
  const establishments = await establishmentRepository.findAllWithUsers();
  const typeAccession = await statisticTypesRepository.findByName("Adesão");

  const typeAllAccession = await statisticTypesRepository.findByName(
    "Adesão total"
  );

  const typeAllAccessionUsers = await statisticTypesRepository.findByName(
    "Usuários adesão total"
  );

  const typeAccessionUsers = await statisticTypesRepository.findByName(
    "Usuários adesão"
  );

  if (!typeAccession) {
    throw new AppError("Tipo de Estatística Adesão não encontrada", 404);
  }

  if (!typeAllAccession) {
    throw new AppError("Tipo de Estatística Adesão Total não encontrada", 404);
  }

  if (!typeAllAccessionUsers) {
    throw new AppError("Tipo de Estatística Usuários Adesão Total não encontrada", 404);
  }

  if (!typeAccessionUsers) {
    throw new AppError("Tipo de Estatística Usuários Adesão não encontrada", 404);
  }

  let accession = 0;
  let accessionUsers = 0;
  let totalUsers = 0;
  let totalAccession = 0;
  let totalAccessionUsers = 0;
  let allUsers = 0;

  const establishment = establishments[0];
  establishment.users = await KeycloakAdmin.usersListComplete();

  accession = 0;
  accessionUsers = 0;
  totalUsers = establishment.users.length;

  for (const user of establishment.users) {
    const diary = await diariesRepository.findByRangeDateByUser(
      date,
      user.id
    );
    if (diary) {
      accessionUsers++;
    }
  }

  totalAccessionUsers += accessionUsers;
  allUsers += totalUsers;

  if (totalUsers > 0) {
    accession = (accessionUsers / totalUsers) * 100;
  }

  await statisticsRepository.create({
    establishment,
    statisticType: typeAccession,
    value: accession,
  });

  await statisticsRepository.create({
    establishment,
    statisticType: typeAccessionUsers,
    value: accessionUsers,
  });

  totalAccession = (totalAccessionUsers / allUsers) * 100;

  await statisticsRepository.create({
    establishment: establishment,
    statisticType: typeAllAccession,
    value: totalAccession,
  });

  await statisticsRepository.create({
    establishment: establishment,
    statisticType: typeAllAccessionUsers,
    value: totalAccessionUsers,
  });
}

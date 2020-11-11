import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from "typeorm";
import Baseline from "@users/baselines/infra/typeorm/entities/Baseline";
import Role from "@security/roles/infra/typeorm/entities/Role";
import Diary from "@users/diaries/infra/typeorm/entities/Diary";
import Establishment from "@establishments/infra/typeorm/entities/Establishment";
import Token from "@users/users/tokens/infra/typeorm/entities/Token";

@Entity("users")
class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  cpf: string;

  @OneToMany((type) => Token, (token) => token.user)
  tokens: Token[];

  @ManyToOne((type) => Role, (role) => role.users)
  role: Role;

  @ManyToMany((type) => Establishment, (establishment) => establishment.users)
  @JoinTable({ name: "users_establishments" })
  establishments: Establishment[];

  @Column()
  roleId: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default User;

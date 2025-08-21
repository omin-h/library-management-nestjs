import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class Member {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  joinedDate: string;
}
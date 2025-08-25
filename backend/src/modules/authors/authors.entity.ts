import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class Author {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  bio: string;

}
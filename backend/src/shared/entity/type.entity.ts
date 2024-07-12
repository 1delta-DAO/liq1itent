import { BaseEntity, PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity()
export class TypeEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: "icon_url", nullable: true })
  iconUrl: string;

  @Column({ nullable: true, type: "int" })
  relevance: number;
}

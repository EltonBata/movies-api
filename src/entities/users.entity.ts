import { Column, Entity, OneToMany } from 'typeorm';
import { BaseColumns } from './baseColumns.entity';
import { Tokens } from './tokens.entity';

@Entity()
export class Users extends BaseColumns {
  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isActive: boolean;

  @OneToMany(() => Tokens, (token) => token.user)
  tokens: Tokens[];
}

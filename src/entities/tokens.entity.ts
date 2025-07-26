import { Column, Entity, ManyToOne } from 'typeorm';
import { Users } from './users.entity';
import { BaseColumns } from './baseColumns.entity';

@Entity()
export class Tokens extends BaseColumns {
  @Column()
  name: string;

  @Column()
  token: string;

  @Column({ type: 'timestamp with time zone' })
  expiresAt: Date;

  @ManyToOne(() => Users, (user) => user.tokens, { onDelete: 'CASCADE' })
  user: Users;
}

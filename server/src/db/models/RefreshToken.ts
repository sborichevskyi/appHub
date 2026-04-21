import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './User';

@Table({ tableName: 'refresh_tokens' })
export class RefreshToken extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  refreshToken!: string;

  @ForeignKey(() => User)
  @Column ({
    type: DataType.UUID,
    allowNull: false,
  })
  userId!: string;
  @BelongsTo(() => User)
  user!: User;

  @Column ({
    type: DataType.DATE,
    allowNull: false,
  })
  expiresAt!: Date;
}
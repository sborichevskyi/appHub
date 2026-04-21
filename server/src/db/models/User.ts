import {
  Table,
  Column,
  Model,
  DataType,
  HasOne,
  HasMany,
} from 'sequelize-typescript';
import { UserProfile } from './UserProfile';
import { Application } from './Application';
import { RefreshToken } from './RefreshToken';

@Table({ tableName: 'users' })
export class User extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  passwordHash!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isActive!: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  activationToken?: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  resetToken?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  resetTokenExpiry?: Date;

  @HasOne(() => UserProfile)
  profile!: UserProfile;

  @HasMany(() => Application)
  applications!: Application[];

  @HasMany(() => RefreshToken)
  refreshTokens!: RefreshToken[];
}
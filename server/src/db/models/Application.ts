import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './User';
import { Job } from './Job';

@Table({ tableName: 'applications', timestamps: true })
export class Application extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId!: string;

  @BelongsTo(() => User)
  user!: User;

  @ForeignKey(() => Job)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  jobId!: string;

  @BelongsTo(() => Job)
  job!: Job;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  appliedAt!: Date;

  @Column({
    type: DataType.ENUM('not_applied', 'applied', 'interview', 'rejected', 'hired'),
    allowNull: false,
    defaultValue: 'not_applied',
  })
  status!: 'not_applied' | 'applied' | 'interview' | 'rejected' | 'hired';
}

import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { Comment } from './Comment';

@Table({ 
  tableName: 'jobs',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['source', 'url'],
    },
  ],
 })
export class Job extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    unique: true,
  })
  id!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  company!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  country?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  location?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  url!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  source!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  level?: string;

  @HasMany(() => Comment, {
    foreignKey: "jobId",
    onDelete: "CASCADE",
    hooks: true,
  })
  comments!: Comment[];
}

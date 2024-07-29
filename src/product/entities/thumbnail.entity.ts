import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Variant } from './variant.entity';

@Entity()
export class Thumbnail {
  @PrimaryGeneratedColumn()
  id: number;
    
  @Column()
  thumbnail: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Variant, (variant) => variant.thumbnail)
  variant?: Variant
}
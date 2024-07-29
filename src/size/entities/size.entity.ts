import { Variant } from 'src/product/entities/variant.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Size {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Variant, (variants) => variants.sizes)
  @JoinTable({
    name: 'variant_size',
    joinColumn: { name: 'size_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'variant_id' },
  })
  variants: Variant[];
}
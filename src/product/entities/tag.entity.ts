import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Product, (products) => products.tags)
  @JoinTable({
    name: 'product_tag',
    joinColumn: { name: 'tag_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'product_id' },
  })
  products: Product[];
}
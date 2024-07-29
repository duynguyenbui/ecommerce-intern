import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { Variant } from './variant.entity';
import { Tag } from './tag.entity';
import { OrderItem } from 'src/order/entities/orderItem.entity';
import { Category } from 'src/category/entities/category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  user_gender: string;

  @Column({ default: false })
  is_delete: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Variant, (variant) => variant.product)
  variant?: Variant[];

  @ManyToOne(() => Category, (category) => category.product)
  category?: Category;

  @ManyToMany(() => Tag, (tags) => tags.products)
  @JoinTable({
    name: 'product_tag',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id' },
  })
  tags: Tag[];
}
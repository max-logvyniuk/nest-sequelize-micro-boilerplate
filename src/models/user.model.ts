import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class User extends Model {
    @Column
    login: string;

    @Column
    firstName: string;

    @Column
    lastName: string;

    @Column({ defaultValue: true })
    isActive: boolean;

    @Column
    password: string;
}

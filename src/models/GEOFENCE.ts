import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Course } from "./COURSE";

@Entity()
export class Geofence {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column("float")
    latitude!: number;

    @Column("float")
    longitude!: number;

    @Column("float")
    radius!: number;

    @ManyToMany(() => Course)
    courses!: Course[];
}
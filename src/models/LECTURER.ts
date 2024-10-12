import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Department } from "./DEPARTMENT";
import { Course } from "./COURSE";

@Entity()
export class Lecturer {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    first_name!: string;

    @Column()
    password!: string;

    @Column()
    last_name!: string;

    @ManyToOne(() => Department, department => department.lecturers)
    department!: Department;

    @Column()
    email!: string;

    @Column()
    role: string = "lecturer";

    @OneToMany(() => Course, course => course.lecturer)
    courses_teaching!: Course[];
}
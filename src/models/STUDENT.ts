import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Department } from "./DEPARTMENT";
import { Course } from "./COURSE";

@Entity()
export class Student {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    first_name!: string;

    @Column()
    last_name!: string;

    @Column()
    password!: string;

    @Column({ unique: true })
    matric_number!: string;

    @ManyToOne(() => Department, department => department.students)
    department!: Department;

    @Column()
    course_of_study!: string;

    @Column()
    level!: string;

    @Column()
    email!: string;

    @Column()
    role: string = "student";

    @ManyToMany(() => Course)
    @JoinTable()
    courses_taking?: Course[];
}

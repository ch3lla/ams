import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Course } from "./COURSE";
import { Lecturer } from "./LECTURER";
import { Student } from "./STUDENT";

@Entity()
export class Department {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    department_name!: string;

    @OneToMany(() => Lecturer, lecturer => lecturer.department)
    lecturers!: Lecturer[];

    @OneToMany(() => Student, student => student.department)
    students!: Student[];

    @OneToMany(() => Course, course => course.department)
    courses!: Course[];
}
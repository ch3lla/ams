import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, Timestamp } from "typeorm";
import { Course } from "./COURSE";
import { Lecturer } from "./LECTURER";
import { Student } from "./STUDENT";


@Entity()
export class Attendance {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => Lecturer, lecturer => lecturer)
    lecturer!: Lecturer;

    @ManyToOne(() => Student, student => student)
    student!: Student;

    @ManyToOne(() => Course, course => course)
    course!: Course;

    @Column("date")
    date_class_was_held!: Date;

    @Column({
        type: "enum",
        enum: ["PRESENT", "ABSENT"],
    })
    status!: "PRESENT" | "ABSENT";

    @Column("timestamp")
    check_in_time!: Timestamp;
}
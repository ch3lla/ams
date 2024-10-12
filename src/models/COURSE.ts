import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Geofence } from "./GEOFENCE";
import { Attendance } from "./ATTENDANCE";
import { Department } from "./DEPARTMENT";
import { Lecturer } from "./LECTURER";
import { Student } from "./STUDENT";

@Entity()
export class Course {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => Lecturer, lecturer => lecturer)
    lecturer!: Lecturer;

    @Column({ unique: true })
    course_code!: string;

    @Column()
    course_name!: string;

    @Column({ nullable: true })
    qr_code!: string;

    @Column({
        type: "enum",
        enum: ["1", "2"],
    })
    semster!: "1" | "2";

    @ManyToOne(() => Department, department => department.courses)
    department!: Department;

    @OneToMany(() => Attendance, attendance => attendance.course)
    attendances!: Attendance[];

    @ManyToMany(() => Student)
    students!: Student[];

    @ManyToMany(() => Geofence)
    @JoinTable()
    venue!: Geofence;
}

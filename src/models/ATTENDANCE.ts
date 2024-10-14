import { Schema, model, Document, Types } from "mongoose";
interface IAttendance extends Document {
    lecturer: Types.ObjectId;
    student: Types.ObjectId;
    course: Types.ObjectId;
    date_class_was_held: Date;
    status: "PRESENT" | "ABSENT";
    check_in_time: Date;
}

const attendanceSchema = new Schema<IAttendance>({
    lecturer: {
        type: Schema.Types.ObjectId,
        ref: 'Lecturer',
        required: true
    },
    student: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    date_class_was_held: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["PRESENT", "ABSENT"],
        required: true
    },
    check_in_time: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

const Attendance = model<IAttendance>('Attendance', attendanceSchema);

export default Attendance;

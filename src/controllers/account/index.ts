import Lecturer from "../../models/LECTURER";
import Student from "../../models/STUDENT";

const getSingleLecturer = async (req: any, res: any) => {   
    const { _id } = req.user;

    try {
        const lecturer = await Lecturer.findById(_id)
        .populate({
            path: "department",
        })
        .select("-password -tokens") as any;

        if (!lecturer) {
            return res.status(404).json({ message: "Lecturer not found" });
        }

        const data = {
            first_name: lecturer.first_name,
            last_name: lecturer.last_name,
            email: lecturer.email,
            department: lecturer.department.name
        }

        res.status(200).json({data, message: "Successful"});
    }catch (error: any) {
        console.error(`Error getting lecturer details: ${error.message}`);
        res.status(500).json({ message: "Error getting lecturer details" });
    }
}

const getSingleStudent = async (req: any, res: any) => {   
    const { _id } = req.user;

    try {
        const student = await Student.findById(_id)
        .populate({
            path: "department",
        })
        .select("-password -tokens") as any;

        if (!student) {
            return res.status(404).json({ message: "Lecturer not found" });
        }

        const data = {
            first_name: student.first_name,
            last_name: student.last_name,
            matric_number: student.matric_number,
            level: student.level,
            email: student.email,
            department: student.department.name
        }

        res.status(200).json({data, message: "Successful"});
    }catch (error: any) {
        console.error(`Error getting student details: ${error.message}`);
        res.status(500).json({ message: "Error getting Student details" });
    }
}

const updateLecturerDetails = async (req: any, res: any) => {
    const { _id } = req.user;

    try {
        const updatedLecturer = await Lecturer.findByIdAndUpdate(
            _id,
            { ...req.body },
            { new: true, runValidators: true }
        ).select("-password -tokens");

        if (!updatedLecturer) {
            return res.status(404).json({ message: "Lecturer not found" });
        }

        res.status(200).json({ data: updatedLecturer, message: "Lecturer details updated successfully" });
    } catch (error: any) {
        console.error(`Error updating lecturer details: ${error.message}`);
        res.status(500).json({ message: "Error updating lecturer details" });
    }
};

const updateStudentDetails = async (req: any, res: any) => {
    const { _id } = req.user;
    const { first_name, last_name, level, email } = req.body;

    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            _id,
            { first_name, last_name, level, email },
            { new: true, runValidators: true }
        ).select("-password -tokens");

        if (!updatedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({ data: updatedStudent, message: "Student details updated successfully" });
    } catch (error: any) {
        console.error(`Error updating student details: ${error.message}`);
        res.status(500).json({ message: "Error updating student details" });
    }
};

export { getSingleLecturer, getSingleStudent, updateLecturerDetails, updateStudentDetails };
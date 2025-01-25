import Attendance from "../../models/ATTENDANCE";
import Course from "../../models/COURSE";
import Student from "../../models/STUDENT";
import Venue from "../../models/VENUE";
import mongoose from "mongoose";
import moment from 'moment';
import pdf from 'html-pdf';

const getAttendanceForCousrseOnASpecificDate = async (req: any, res: any) => {
  const { _id } = req.user;
  const { course_id, date } = req.query;

    if (!course_id || !date) {
        return res.status(400).json({ message: "Course ID and date are required" });
    }
    try {

        const startOfDay = new Date(date); // 2025-01-19T00:00:00.000Z
        const endOfDay = new Date(date);
        endOfDay.setUTCDate(startOfDay.getUTCDate() + 1);

        const attendanceRecords = await Attendance.find({ lecturer: _id, course: course_id, date_class_was_held: {
            $gte: startOfDay,
            $lt: endOfDay // Use $lt for exclusive end
        }})
            .populate([
            {
                path: "course",
                select: "_id course_code course_name semester venue start_time end_time"
            },
            {
                path: "lecturer",
                select: "first_name last_name email"
            },
            {
                path: "student",
                select: "first_name last_name email matric_number"
            }

            ])
            .sort({ updatedAt: -1 })
            .lean() as any;

        if (!attendanceRecords || attendanceRecords.length === 0) {
            return res.status(404).json({ message: "Attendance record not found" });
        }

        const attendance_details = attendanceRecords.map((record: any) => ({
            _id: record._id,
            student_id: record.student._id,
            student_name: `${record.student.first_name} ${record.student.last_name}`,
            matric_number: record.student.matric_number,
            status: record.status,
            check_in_time: record.check_in_time
        }));

        const courseDetails = attendanceRecords[0].course;

        const data = {
            course_id: courseDetails._id,
            course_name: courseDetails.course_name,
            course_code: courseDetails.course_code,
            attendance_details
        }

        res.status(200).json({data, message: "successful"});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error marking attendance" });
  }
};

const updateStudentAttendanceRecord = async (req: any, res: any) => {
    const { attendance_id } = req.params;
    const { status } = req.body;

    if (!attendance_id || !status) {
        return res.status(400).json({messag: "Invalid parametes"});
    }

    try {
        const attendance = await Attendance.findByIdAndUpdate(
            {_id: mongoose.Types.ObjectId.createFromHexString(attendance_id)}, 
            {status: status.toUpperCase()}, 
            { new: true }
        );

        if (!attendance) {
            return res.status(404).json({message: "Attendance record not found"});
        }

        res.status(200).json({message: "successful"});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error marking attendance" });
  }
}

// const exportAttendanceToPDF = async (req: any, res: any) => {
//     const { _id } = req.user;
//     const { course_id } = req.params;

//     if (!course_id) {
//         return res.status(400).json({ message: "Course ID is required" });
//     }

//     try {
//         const attendanceRecords = await Attendance.find({ lecturer: _id, course: course_id})
//             .populate([
//             {
//                 path: "course",
//                 select: "_id course_code course_name semester venue start_time end_time"
//             },
//             {
//                 path: "lecturer",
//                 select: "first_name last_name email"
//             },
//             {
//                 path: "student",
//                 select: "first_name last_name email matric_number"
//             }

//             ])
//             .sort({ updatedAt: -1 })
//             .lean() as any;

//         if (!attendanceRecords || attendanceRecords.length === 0) {
//             return res.status(404).json({ message: "Attendance record not found" });
//         }

//         // const doc = new PDFDocument();

//         // doc.fontSize(20).text('Attendance Report', { align: 'center' }).moveDown();
      
//         // const margin = 50;
//         // const columnWidths = {
//         //   name: 200,
//         //   date: 120,
//         //   matricNumber: 120,
//         //   status: 100
//         // };
      
//         // doc.fontSize(12).font('Helvetica-Bold');
      
//         // doc.text('Student Name', margin, doc.y, { width: columnWidths.name, continued: true })
//         //    .text('Date', { width: columnWidths.date, continued: true })
//         //    .text('Matric Number', { width: columnWidths.matricNumber, continued: true })
//         //    .text('Status', { align: 'right' });
      
//         // doc.moveDown().fontSize(10).font('Helvetica')
//         //    .moveTo(margin, doc.y).lineTo(595 - margin, doc.y).stroke().moveDown();
      
//         // attendanceRecords.forEach((record: any) => {
//         //   doc.text(`${record.student.first_name} ${record.student.last_name}`, margin, null, { width: columnWidths.name, continued: true })
//         //      .text(moment(record.date_class_was_held).format('DD/MM/YYYY'), { width: columnWidths.date, continued: true })
//         //      .text(record.student.matric_number, { width: columnWidths.matricNumber, continued: true })
//         //      .text(record.status, { align: 'right' })
//         //      .moveDown(0.5);
//         // });
      
//         // doc.fontSize(8)
//         //    .text(`Course: ${attendanceRecords[0].course.course_code}`, margin, doc.page.height - 50)
//         //    .text(`Generated on: ${moment().format('DD/MM/YYYY HH:mm')}`, margin, doc.page.height - 40);
      
//         // const fileName = `attendance_${attendanceRecords[0].course.course_code}_${moment().format('YYYYMMDD')}.pdf`;
      
//         // res.setHeader('Content-Type', 'application/pdf');
//         // res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
      
//         // doc.pipe(res);
//         // doc.end();

//         const doc = new PDFDocument();

//         doc.fontSize(20).text('Attendance Report', { align: 'center' }).moveDown();
    
//         const tableData = attendanceRecords.map((record: any) => ({
//           'Student Name': `${record.student.first_name} ${record.student.last_name}`,
//           Date: moment(record.date_class_was_held).format('DD/MM/YYYY'),
//           'Matric Number': record.student.matric_number,
//           Status: record.status,
//         }));
    
//         const table = new Table({
//           rows: tableData,
//           keepWithParent: true,
//           // Add this option to evenly space columns
//           width: 500, // Adjust this value as needed
//         });
    
//         table.draw(doc, { x: 50, y: doc.y });
    
//         doc.fontSize(8)
//           .text(`Course: ${attendanceRecords[0].course.course_code}`, 50, doc.y + 50)
//           .text(`Generated on: ${moment().format('DD/MM/YYYY HH:mm')}`, 50, doc.y + 60);
    
//         const fileName = `attendance_${attendanceRecords[0].course.course_code}_${moment().format('YYYYMMDD')}.pdf`;
    
//         res.setHeader('Content-Type', 'application/pdf');
//         res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    
//         doc.pipe(res);
//         doc.end();
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Error marking attendance" });
//     }
// }

const generateAttendanceTableHTML = (attendanceRecords: any) => {
    const tableRows = attendanceRecords.map((record: { student: { matric_number: any; first_name: any; last_name: any; }; createdAt: moment.MomentInput; status: any; }) => `
        <tr>
            <td>${record.student.matric_number}</td>
            <td>${record.student.first_name} ${record.student.last_name}</td>
            <td>${moment(record.createdAt).format('YYYY-MM-DD HH:mm')}</td>
            <td>${record.status}</td>
        </tr>
    `).join('');

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; }
                table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    margin-bottom: 20px; 
                }
                th, td { 
                    border: 1px solid #ddd; 
                    padding: 8px; 
                    text-align: left; 
                }
                th { 
                    background-color: #f2f2f2; 
                    font-weight: bold; 
                }
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>${attendanceRecords[0].course.course_code} - ${attendanceRecords[0].course.course_name}</h2>
                <p>Semester: ${attendanceRecords[0].course.semester}</p>
                <p>Lecturer: ${attendanceRecords[0].lecturer.first_name} ${attendanceRecords[0].lecturer.last_name}</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Matric Number</th>
                        <th>Student Name</th>
                        <th>Attendance Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        </body>
        </html>
    `;
};

const exportAttendanceToPDF = async (req: any, res: any) => {
    const { _id } = req.user;
    const { course_id } = req.params;

    if (!course_id) {
        return res.status(400).json({ message: "Course ID is required" });
    }

    try {
        const attendanceRecords = await Attendance.find({ lecturer: _id, course: course_id })
            .populate([
                {
                    path: "course",
                    select: "_id course_code course_name semester venue start_time end_time",
                },
                {
                    path: "lecturer",
                    select: "first_name last_name email",
                },
                {
                    path: "student",
                    select: "first_name last_name email matric_number",
                },
            ])
            .sort({ updatedAt: -1 })
            .lean() as any;

        if (!attendanceRecords || attendanceRecords.length === 0) {
            return res.status(404).json({ message: "Attendance record not found" });
        }

        const htmlContent = generateAttendanceTableHTML(attendanceRecords);

        const pdfOptions = {
            format: 'A4',
            orientation: 'portrait',
            border: {
                top: "10mm",
                right: "10mm",
                bottom: "10mm",
                left: "10mm"
            }
        };

        pdf.create(htmlContent, pdfOptions).toBuffer((err, buffer) => {
            if (err) {
                console.error('PDF generation error:', err);
                return res.status(500).json({ message: "Error generating PDF" });
            }

            res.contentType('application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=attendance_${course_id}_${Date.now()}.pdf`);
            res.send(buffer);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error generating attendance PDF" });
    }
};


export {
    getAttendanceForCousrseOnASpecificDate,
    updateStudentAttendanceRecord,
    exportAttendanceToPDF
}


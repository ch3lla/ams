-- Drop existing tables if they exist
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS geofences CASCADE;
DROP TABLE IF EXISTS lecturers CASCADE;
DROP TABLE IF EXISTS student_course CASCADE;
DROP TABLE IF EXISTS course_geofence CASCADE;
DROP TABLE IF EXISTS students CASCADE;

-- Drop existing types if they exist
DROP TYPE IF EXISTS semester_order CASCADE;
DROP TYPE IF EXISTS attendance_status CASCADE;

-- Create Enum types
CREATE TYPE semester_order AS ENUM ('1', '2');
CREATE TYPE attendance_status AS ENUM ('PRESENT', 'ABSENT');

-- Create DEPARTMENT table if it does not exist
CREATE TABLE IF NOT EXISTS department (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_name VARCHAR(255) NOT NULL
);

-- Create LECTURER table if it does not exist
CREATE TABLE IF NOT EXISTS lecturer (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    department_id UUID NOT NULL,
    courses_teaching VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'LECTURER',
    FOREIGN KEY (department_id) REFERENCES department(id)
);

-- Create STUDENT table if it does not exist
CREATE TABLE IF NOT EXISTS student (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    matric_number VARCHAR(50) UNIQUE NOT NULL,
    department_id UUID NOT NULL,
    course_of_study VARCHAR(255) NOT NULL,
    level VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'STUDENT',
    FOREIGN KEY (department_id) REFERENCES department(id)
);

-- Create COURSE table if it does not exist
CREATE TABLE IF NOT EXISTS course (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lecturer_id UUID NOT NULL,
    course_code VARCHAR(50) UNIQUE NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    venue UUID,
    qr_code VARCHAR(255),
    semester semester_order NOT NULL,
    department_id UUID NOT NULL,
    FOREIGN KEY (lecturer_id) REFERENCES lecturer(id),
    FOREIGN KEY (department_id) REFERENCES department(id)
);

-- Create ATTENDANCE table if it does not exist
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lecturer_id UUID NOT NULL,
    student_id UUID NOT NULL,
    course_id UUID NOT NULL,
    date_class_was_held DATE NOT NULL,
    status attendance_status NOT NULL,
    check_in_time TIMESTAMP,
    FOREIGN KEY (lecturer_id) REFERENCES lecturer(id),
    FOREIGN KEY (student_id) REFERENCES student(id),
    FOREIGN KEY (course_id) REFERENCES course(id)
);

-- Create GEOFENCE table if it does not exist
CREATE TABLE IF NOT EXISTS geofence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    radius FLOAT
);

-- Create junction table for COURSE and GEOFENCE (many-to-many relationship)
CREATE TABLE IF NOT EXISTS course_geofence (
    course_id UUID,
    geofence_id UUID,
    PRIMARY KEY (course_id, geofence_id),
    FOREIGN KEY (course_id) REFERENCES course(id),
    FOREIGN KEY (geofence_id) REFERENCES geofence(id)
);

-- Create junction table for STUDENT and COURSE (many-to-many relationship)
CREATE TABLE IF NOT EXISTS student_course (
    student_id UUID,
    course_id UUID,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES student(id),
    FOREIGN KEY (course_id) REFERENCES course(id)
);

-- INSERT DEPARTMENT DATA INTO DEPARTMENT TABLE
-- Ensure to use UUIDs or generate them for the 'id' field
INSERT INTO department (id, department_name) VALUES
(gen_random_uuid(), 'Computer Science'),
(gen_random_uuid(), 'Software Engineering'),
(gen_random_uuid(), 'Computer Information System'),
(gen_random_uuid(), 'Computer Technology'),
(gen_random_uuid(), 'Information Technology');


-- \i 'C:\\Users\\HP\\Desktop\\proj\\ams\\src\\utils\\create_schemas.sql'
-- Drop existing tables if they exist
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS geofences CASCADE;
DROP TABLE IF EXISTS lecturers CASCADE;

-- Define ENUM types (if not defined yet)
DROP TYPE IF EXISTS semester CASCADE;
DROP TYPE IF EXISTS attendance_status CASCADE;

-- Create Enum types
CREATE TYPE semester_order AS ENUM ('1', '2');
CREATE TYPE attendance_status AS ENUM ('PRESENT', 'ABSENT');

-- Create DEPARTMENT table
CREATE TABLE DEPARTMENT (
    id UUID PRIMARY KEY,
    department_name VARCHAR(255) NOT NULL
);

-- Create LECTURER table
CREATE TABLE LECTURER (
    id UUID PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    department_id UUID NOT NULL,
    courses_teaching VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    FOREIGN KEY (department_id) REFERENCES DEPARTMENT(id)
);

-- Create STUDENT table
CREATE TABLE STUDENT (
    id UUID PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    matric_number VARCHAR(50) UNIQUE NOT NULL,
    department_id UUID NOT NULL,
    course_of_study VARCHAR(255) NOT NULL,
    courses_taking VARCHAR(255),
    level VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    FOREIGN KEY (department_id) REFERENCES DEPARTMENT(id)
);

-- Create COURSE table
CREATE TABLE COURSE (
    id UUID PRIMARY KEY,
    lecturer_id UUID NOT NULL,
    course_code VARCHAR(50) UNIQUE NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    venue UUID,
    qr_code VARCHAR(255),
    semster semester_order NOT NULL,
    department_id UUID NOT NULL,
    FOREIGN KEY (lecturer_id) REFERENCES LECTURER(id),
    FOREIGN KEY (department_id) REFERENCES DEPARTMENT(id)
);

-- Create ATTENDANCE table
CREATE TABLE ATTENDANCE (
    id UUID PRIMARY KEY,
    lecturer_id UUID NOT NULL,
    student_id UUID NOT NULL,
    course_id UUID NOT NULL,
    date_class_was_held DATE NOT NULL,
    status attendance_status NOT NULL,
    check_in_time TIMESTAMP,
    FOREIGN KEY (lecturer_id) REFERENCES LECTURER(id),
    FOREIGN KEY (student_id) REFERENCES STUDENT(id),
    FOREIGN KEY (course_id) REFERENCES COURSE(id)
);

-- Create GEOFENCE table
CREATE TABLE GEOFENCE (
    id UUID PRIMARY KEY,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    radius FLOAT
);

-- Create junction table for COURSE and GEOFENCE (many-to-many relationship)
CREATE TABLE COURSE_GEOFENCE (
    course_id UUID,
    geofence_id UUID,
    PRIMARY KEY (course_id, geofence_id),
    FOREIGN KEY (course_id) REFERENCES COURSE(id),
    FOREIGN KEY (geofence_id) REFERENCES GEOFENCE(id)
);

-- Create junction table for STUDENT and COURSE (many-to-many relationship)
CREATE TABLE STUDENT_COURSE (
    student_id UUID,
    course_id UUID,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES STUDENT(id),
    FOREIGN KEY (course_id) REFERENCES COURSE(id)
);
export type UserRole = "student" | "faculty" | "admin";
export type RecordStatus = "active" | "inactive" | "pending" | "approved" | "rejected" | "completed" | "cancelled";
export interface UserRecord { uid:string; name:string; email:string; role:UserRole; status:RecordStatus; photoURL?:string; phone?:string; createdAt?:string; updatedAt?:string; }
export interface StudentRecord extends UserRecord { role:"student"; studentId:string; registerNumber:string; courseId:string; departmentId:string; semesterId:string; sectionId:string; admissionYear:number; }
export interface FacultyRecord extends UserRecord { role:"faculty"; employeeId:string; departmentId:string; designation:string; qualification?:string; specialization?:string; joiningDate?:string; }
export interface CourseRecord { id:string; name:string; code:string; departmentId:string; duration:string; semesters:number; eligibility:string; description:string; status:RecordStatus; }
export interface DepartmentRecord { id:string; name:string; code:string; hodId?:string; description:string; status:RecordStatus; }

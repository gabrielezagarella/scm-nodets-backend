import User from "./user.model";
import Subject from "../interfaces/subject.model";

export default interface Course {
  _id?: string;
  name: string;
  year: number;
  status: string;
  students?: User[];
  teachers?: User[];
  subjects?: Subject[];
}

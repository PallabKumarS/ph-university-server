import { Schema, model } from 'mongoose';
import {
  TCourse,
  TCourseTeacher,
  TPreRequisiteCourses,
} from './course.interface';

const preRequisiteCoursesSchema = new Schema<TPreRequisiteCourses>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  },
);

const courseSchema = new Schema<TCourse>(
  {
    title: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    prefix: {
      type: String,
      trim: true,
      required: true,
    },
    code: {
      type: Number,
      trim: true,
      required: true,
    },
    credits: {
      type: Number,
      trim: true,
      required: true,
    },
    preRequisiteCourses: [preRequisiteCoursesSchema],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const CourseModel = model<TCourse>('Course', courseSchema);

const courseTeacherSchema = new Schema<TCourseTeacher>({
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    unique: true,
  },
  teachers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
    },
  ],
});

export const CourseTeacherModel = model<TCourseTeacher>(
  'CourseTeacher',
  courseTeacherSchema,
);

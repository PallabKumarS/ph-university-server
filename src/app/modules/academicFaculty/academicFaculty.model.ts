import { Schema, model } from 'mongoose';
import { TAcademicFaculty } from './academicFaculty.interface';
import { AppError } from '../../middlewares/globalErrorhandler';
import httpStatus from 'http-status';

const academicFacultySchema = new Schema<TAcademicFaculty>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

academicFacultySchema.pre('save', async function (next) {
  const isFacultyExists = await AcademicFacultyModel.findOne({
    name: this.name,
  });

  if (isFacultyExists) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      'This Faculty already exists !',
    );
  }
  next();
});

export const AcademicFacultyModel = model<TAcademicFaculty>(
  'AcademicFaculty',
  academicFacultySchema,
);

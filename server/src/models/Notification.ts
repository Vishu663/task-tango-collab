import mongoose, { Document, Schema } from 'mongoose';
import { ITask } from './Task';

export interface INotification extends Document {
  _id: string;
  message: string;
  taskId: string;
  userId: string;
  read: boolean;
  timestamp: Date;
  populatedTaskId?: ITask;
}

const notificationSchema = new Schema({
  message: {
    type: String,
    required: true
  },
  taskId: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret._id = ret._id.toString();
      ret.taskId = ret.taskId.toString();
      ret.userId = ret.userId.toString();
      ret.timestamp = ret.timestamp.toISOString();
      return ret;
    }
  },
  toObject: {
    virtuals: true
  }
});

// Virtual for populated task data
notificationSchema.virtual('populatedTaskId', {
  ref: 'Task',
  localField: 'taskId',
  foreignField: '_id',
  justOne: true
});

export const Notification = mongoose.model<INotification>('Notification', notificationSchema); 
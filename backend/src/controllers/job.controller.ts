import { Job } from '../models/Job.js';
import { sendSuccess, sendError } from '../utils/response.utils.js';

export const createJob = async (req: any, res: any, next: any) => {
  try {
    const { workerId, description } = req.body;
    const customerId = req.user.id;

    if (workerId === customerId) {
      return sendError(res, 'You cannot hire yourself', 400);
    }

    const job = new Job({
      customerId,
      workerId,
      description,
    });
    await job.save();

    return sendSuccess(res, 'Job created successfully', { job }, 201);
  } catch (error) {
    next(error);
  }
};

export const getJobs = async (req: any, res: any, next: any) => {
  try {
    const userId = req.user.id;
    
    const jobs = await Job.find({
      $or: [{ customerId: userId }, { workerId: userId }]
    })
      .populate('customerId', 'name email photo')
      .populate('workerId', 'name email photo')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 'Jobs retrieved successfully', { jobs });
  } catch (error) {
    next(error);
  }
};

export const updateJobStatus = async (req: any, res: any, next: any) => {
  try {
    const { jobId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return sendError(res, 'Job not found', 404);
    }

    const isCustomer = job.customerId.toString() === userId;
    const isWorker = job.workerId.toString() === userId;

    if (!isCustomer && !isWorker) {
      return sendError(res, 'Unauthorized access to this job', 403);
    }

    const validTransitions: any = {
      worker: {
        'pending': ['accepted', 'rejected'],
        'accepted': ['in-progress'],
        'in-progress': ['worker-completed'],
      },
      customer: {
        'worker-completed': ['completed'],
        'pending': ['cancelled'],
        'accepted': ['cancelled'],
      }
    };

    const role = isWorker ? 'worker' : 'customer';
    const allowed = validTransitions[role][job.status as string];
    
    if (!allowed || !allowed.includes(status)) {
      return sendError(res, `Cannot transition status from ${job.status} to ${status} as a ${role}`, 400);
    }

    job.status = status;
    await job.save();

    return sendSuccess(res, 'Job status updated', { job });
  } catch (error) {
    next(error);
  }
};

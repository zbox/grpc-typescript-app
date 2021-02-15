import * as grpc from 'grpc';

import {EnumStatus, IdObject, Result, StatusObject, TaskObject} from '../proto/task/gen/task_pb';
import {ITasksServer, TasksService} from '../proto/task/gen/task_grpc_pb';

import tasks from '../storage/tasks.json';

class TaskHandler implements ITasksServer {
  getById = (call: grpc.ServerUnaryCall<IdObject>, callback: grpc.sendUnaryData<TaskObject>): void => {

    const id = call.request.getId();
    const task =
      new TaskObject()
        .setId(id)
        .setPayload(`Message ${id} payload`)
        .setStatus(EnumStatus.PROCESSED);

    callback(null, task);
  };

  createTask = (call: grpc.ServerUnaryCall<TaskObject>, callback: grpc.sendUnaryData<Result>): void => {
    callback(null, new Result().setDone(false).setMeta('error message'));
  };

  deleteTask = (call: grpc.ServerUnaryCall<IdObject>, callback: grpc.sendUnaryData<Result>): void => {
    callback(null, new Result().setDone(true));
  };

  getStatuses = (call: grpc.ServerDuplexStream<IdObject,StatusObject>): void => {
    call.on('data', (request: IdObject) => {

      const item = tasks.find(task => task.id === request.getId());
      const task =
          new StatusObject()
              .setId(request.getId())
              .setStatus(item.status);
      call.write(task);
    });
    call.on('end', () => {
      call.end();
    });
  };
}

export default {
  service: TasksService,
  handler: new TaskHandler(),
};

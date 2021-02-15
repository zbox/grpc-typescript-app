import * as grpc from 'grpc';

import { IdObject, StatusObject, TaskObject} from './proto/task/gen/task_pb';
import { TasksClient } from './proto/task/gen/task_grpc_pb';

const host: string = process.env.GRPC_SERVER_HOST || '0.0.0.0';
const port: string | number = process.env.GRPC_SERVER_PORT || 38002;

const client = new TasksClient(`${host}:${port}`, grpc.credentials.createInsecure());

const getTask = async (id: number)  => {
    return new Promise((resolve) => {
        client.getById(new IdObject().setId(id), (error, task: TaskObject) => {
            console.log(`GetTask: ${JSON.stringify(task.toObject())}`);
            resolve(task);
        });
    });
}

const getStatuses = async () => {
    return new Promise<void>((resolve) => {
        const stream: grpc.ClientDuplexStream<IdObject, StatusObject> = client.getStatuses();

        stream.on('data', (res: StatusObject) => {
            console.log(`GetStatuses: ${JSON.stringify(res.toObject())}`);
        });
        stream.on('end', () => {
            console.log('Connection closed')
            resolve();
        });

        for (let i = 1; i <= 5; i++) {
            console.log(`Request status of task: ${i}`);
            stream.write(new IdObject().setId(i));
        }
        stream.end();
    });
};

(async () => {
    await getTask(1)
    await getStatuses()
})().catch(e => console.log(e));

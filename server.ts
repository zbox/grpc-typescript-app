import * as grpc from 'grpc';

import taskHandler from './handlers/task';

const port: string | number = process.env.GRPC_SERVER_PORT || 38002;

export const runServer = (): void => {
  const server: grpc.Server = new grpc.Server();

  server.addService(taskHandler.service, taskHandler.handler);

  server.bindAsync(
      `0.0.0.0:${ port }`,
      grpc.ServerCredentials.createInsecure(),
      (err: Error, port: number) => {
        if (err != null) {
          return console.error(err);
        }
        console.log(`gRPC server is listening on port ${ port }`);
      },
  );
  server.start();
};

runServer();

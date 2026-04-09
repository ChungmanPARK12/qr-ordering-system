import http from "http";
import app from "./app";

const PORT = process.env.PORT || 4001;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

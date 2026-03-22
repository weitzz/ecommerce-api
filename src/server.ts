import app from "./app";
import { startRefreshTokenCleanupJob } from "./infra/refresh-token-cleanup.job";

const port = Number(process.env.PORT) || 8080;

// if (process.env.NODE_ENV !== "test") {
//     startRefreshTokenCleanupJob()
// }

app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on ${port} 👽 🤙`);
});
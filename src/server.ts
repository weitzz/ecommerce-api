import app from "./app";
import { startRefreshTokenCleanupJob } from "./infra/refresh-token-cleanup.job";

const port = process.env.PORT || 4000;

if (process.env.NODE_ENV !== "test") {
    startRefreshTokenCleanupJob()
}

app.listen(port, () => {
    console.log(`Server is running on ${port} 👽 🤙`);
});
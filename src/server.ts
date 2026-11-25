// Study: Start the configured Express app on the port from the environment.
// Study: Import `app` from `"./app"`.
import app from "./app";
// Study: Import `{ env }` from `"./config/env"`.
import { env } from "./config/env";

// Study: Start accepting HTTP requests on `env.PORT`.
app.listen(env.PORT, () => {
  // Study: Call `console.log`.
  console.log(`🚀 Server running on port ${env.PORT}`);
// Study: Close the code block.
});
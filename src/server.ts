// Study: Starts the part of the CRM that listens for requests from the screens people use.
// Study: Bring in `app` from `"./app"` so this file can use it.
import app from "./app";
// Study: Bring in `{ env }` from `"./config/env"` so this file can use it.
import { env } from "./config/env";

// Study: Start accepting HTTP requests on `env.PORT`.
app.listen(env.PORT, () => {
  // Study: Call `console.log`.
  console.log(`🚀 Server running on port ${env.PORT}`);
// Study: End this group of steps.
});
import { logger } from "./application/logger";
import { web } from "./application/web";

web.listen(3000, () => {
	logger.info("Listerning on port 3000");
});

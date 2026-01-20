import { Router } from "express";
import { matchingController } from "./service";
import { authenticate } from "../../middleware/auth";

const router = Router();

router.get(
  "/requests/:requestId",
  authenticate,
  matchingController.getMatchesForRequest.bind(matchingController)
);
router.get(
  "/listings/:listingId",
  authenticate,
  matchingController.getMatchesForListing.bind(matchingController)
);
router.post(
  "/initiate",
  authenticate,
  matchingController.initiateTransaction.bind(matchingController)
);

export default router;

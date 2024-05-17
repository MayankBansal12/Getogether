// Router for channel(sub event) -> /channel
import { Router, Request, Response } from "express";

const router = Router();

// /channel/:channelId -> For creating/editing that sub event 
router.route("/:channelId")
    .get((req: Request, res: Response) => {

    })
    .put((req: Request, res: Response) => {

    })
    .delete((req: Request, res: Response) => {

    })

// /channel/group/create -> Creating a new group inside a sub event
router.post("/group/create", (req: Request, res: Response) => {

});

// /channel/user -> Adding /removing a user from sub event
router.post("/channel/user", (req: Request, res: Response) => {

})

// /channel/list -> Listing all users from that sub event
router.get("/channel/list", (req: Request, res: Response) => {

})

export default router;
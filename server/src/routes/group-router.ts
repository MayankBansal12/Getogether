// Router for groups -> /group

import { Router, Request, Response } from "express";

const router = Router();

// /group/:groupId -> For fetching, editing, deleting group details with that id
router.route("/:groupId")
    .get((req: Request, res: Response) => {

    })
    .put((req: Request, res: Response) => {

    })
    .delete((req: Request, res: Response) => {

    })

// /group/message/list -> listing all messages from that group
router.get("/message/list", (req: Request, res: Response) => {

})

// /group/message/send -> sending a new message in that group
router.post("/message/send", (req: Request, res: Response) => {

})

export default router;
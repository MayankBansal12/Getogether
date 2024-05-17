// Route for events related operations -> /event

import { Router, Request, Response } from 'express';

const router = Router();

// /event/create -> For creating new event
router.post("/create", (req: Request, res: Response) => {

})

// /event/list -> For listing all sub events (and groups if param passed)
router.get("/list", (req: Request, res: Response) => {

})

// /event/join -> Inviting a new user to event
router.post("/join", (req: Request, res: Response) => {

})

// /event/remove -> Removing a user from event
router.post("/remove", (req: Request, res: Response) => {

})

// /event/user/role -> Assigning/changing a user role
router.post("/role", (req: Request, res: Response) => {

})

// /event/:eventId -> For fetching, editing, deleting event details with that id
router.route("/:eventId")
    .get((req: Request, res: Response) => {

    })
    .put((req: Request, res: Response) => {

    })
    .delete((req: Request, res: Response) => {

    })

// /event/channel/create -> Creating a new sub evet inside a event
router.post("/channel/create", (req: Request, res: Response) => {

});

// /event/participants -> Fetching all events participants
router.get("/participants", (req: Request, res: Response) => {

});

export default router;
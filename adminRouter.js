import express from "express";
import modal from "./Model.js";
const router = express.Router();

router.post('/banUser', async (req, res) => {
    try {
        var info = req.body;
        await modal.findOne({ email: info.email }).then(async (resdataa) => {
            if (resdataa) {
                await modal.updateOne({ email: info.email }, { $set: { isBan: true } }).then(() => {
                    res.json({ status: 200, msg: "user has been banned successfully" });
                })
            }
        })
    } catch (error) {

    }
})

export default router;
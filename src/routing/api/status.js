import express from 'express';

const router = new express.Router();

router.all('*', (req, res) => {
	res.status(200).json({ online: true });
});

export default router;

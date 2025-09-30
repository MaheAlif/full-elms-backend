import { Router } from 'express';

const router = Router();

// Placeholder student routes - will be implemented in Phase 3
router.get('/courses', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Student courses endpoint - Implementation coming in Phase 3'
  });
});

router.get('/materials', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Student materials endpoint - Implementation coming in Phase 3'
  });
});

router.get('/calendar', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Student calendar endpoint - Implementation coming in Phase 3'
  });
});

router.get('/chat', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Student chat endpoint - Implementation coming in Phase 4'
  });
});

router.post('/chat/send', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Student chat send endpoint - Implementation coming in Phase 4'
  });
});

export default router;
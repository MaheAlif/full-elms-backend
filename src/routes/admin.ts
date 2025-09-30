import { Router } from 'express';

const router = Router();

// Placeholder admin routes - will be implemented in Phase 6
router.get('/courses', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Admin courses endpoint - Implementation coming in Phase 6'
  });
});

router.post('/courses', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Admin create course endpoint - Implementation coming in Phase 6'
  });
});

router.get('/teachers', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Admin teachers endpoint - Implementation coming in Phase 6'
  });
});

router.get('/students', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Admin students endpoint - Implementation coming in Phase 6'
  });
});

router.post('/enrollments', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Admin enrollments endpoint - Implementation coming in Phase 6'
  });
});

export default router;
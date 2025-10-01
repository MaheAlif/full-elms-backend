import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { 
  validateLogin, 
  validateUpdateProfile,
  validateIdParam 
} from '../middleware/validation';

const router = Router();

// Public routes (no authentication required)
router.post('/login', validateLogin, AuthController.login);
router.post('/register', AuthController.register); // In production, make this admin-only

// Protected routes (authentication required)
router.post('/logout', authenticateToken, AuthController.logout);
router.get('/session', authenticateToken, AuthController.getSession);
router.put('/profile', authenticateToken, validateUpdateProfile, AuthController.updateProfile);
router.put('/change-password', authenticateToken, AuthController.changePassword);

// Admin-only routes
router.get('/stats', authenticateToken, requireAdmin, AuthController.getStats);

export default router;
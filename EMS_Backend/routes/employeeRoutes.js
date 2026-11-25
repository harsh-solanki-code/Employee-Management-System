const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  createEmployee,
  listEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');
const {
  validateEmployeeBody,
  validateEmployeeQuery,
  validateEmployeeId
} = require('../middleware/validateEmployee');

const router = express.Router();

router.use(authMiddleware);

router.route('/')
  .get(validateEmployeeQuery, listEmployees)
  .post(validateEmployeeBody(), createEmployee);

router.route('/:id')
  .all(validateEmployeeId)
  .get(getEmployee)
  .put(validateEmployeeBody(), updateEmployee)
  .patch(validateEmployeeBody({ partial: true }), updateEmployee)
  .delete(deleteEmployee);

module.exports = router;

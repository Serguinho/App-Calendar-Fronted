const { Router } = require("express");
const { validateJWT } = require("../middlewares/revalidate-jwt");
const { getEvents, createEvent, updateEvent, deleteEvent } = require("../controllers/eventss");
const { check } = require("express-validator");
const { validateField } = require("../middlewares/fieldsvalidators");
const { isDate } = require("../helpers/isDate");

const router = Router();


router.use(validateJWT);


router.get(
    '/',
//       [//middlewares
//       check('n', 'El nombre es obligatorio').not().isEmpty(),
//       check('email', 'El email es obligatorio').isEmail() ,
//       check('password', 'El password debe tener al menos 6 caracteres').isLength({min:6}),
//       validateField
//   ],
    getEvents
    );

router.post('/',
  [//middlewares
  check('title', 'El el título es obligatorio').not().isEmpty(),
  check('start', 'La fecha de inicio es obligatoria').custom(isDate),
  check('end', 'La fecha de finalización es obligatoria').custom(isDate),
  validateField
],
createEvent
);

router.put('/:id',validateJWT,updateEvent);

router.delete('/:id',validateJWT,deleteEvent);

module.exports = router;
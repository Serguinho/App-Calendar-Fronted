

/* Rutas de usuarios/Auth
host + /api/auth */

const {Router, request} = require('express');
const {check} = require('express-validator')
const {createUser,loginUser,revalidateToken} = require('../controllers/auth');
const { validateField } = require('../middlewares/fieldsvalidators');
const { validateJWT } = require('../middlewares/revalidate-jwt');
const router=Router();




router.post(
    '/new',
    [//middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail() ,
        check('password', 'El password debe tener al menos 6 caracteres').isLength({min:6}),
        validateField
    ],
    createUser);

router.post(
    '/', 
[
check('email', 'El email es obligatorio').isEmail() ,
check('password', 'El password debe tener al menos 6 caracteres').isLength({min:6}),
validateField
]
,loginUser);

router.get('/renew',validateJWT,revalidateToken);

module.exports=router;


    
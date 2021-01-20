module.exports = authorize;

function authorize(roles = []) {
    // roles param can be a single role string (e.g. Role.User or 'User')
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

     return (req, res, next) => {

        if  (roles.length && !roles.includes(req.user.role)) {
            // user's role is not authorized for the given route.
            return res.status(501).json({ message: 'Unauthorized' });
        }
        // authentication and authorization successful
        next();
    }
}



"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deSanatizeMobile = exports.sanatizeMobile = exports.validateMobile = exports.getPaginationInfo = exports.mongoDBProjectFields = exports.applyRoutes = exports.applyMiddleware = void 0;
const auth_middleware_1 = require("../middleware/auth.middleware");
// load all middleware with this function call
exports.applyMiddleware = (middlewareWrappers, router) => {
    for (const wrapper of middlewareWrappers) {
        wrapper(router);
    }
};
// loading all routes and initialize to use them.
exports.applyRoutes = (routes, router) => {
    for (const route of routes) {
        const { method, path, escapeAuth, handler, adminOnly, role } = route;
        if (escapeAuth) {
            router[method](path, handler);
        }
        else if (role) {
            router[method](path, [auth_middleware_1.Authorization, auth_middleware_1.RoleAuthorization(role), ...handler]);
        }
        else if (adminOnly) {
            router[method](path, [auth_middleware_1.Authorization, auth_middleware_1.AdminAuthorization, ...handler]);
        }
        else {
            router[method](path, [auth_middleware_1.Authorization, ...handler]);
        }
    }
    return router;
};
exports.mongoDBProjectFields = (fieldsString, prefix) => {
    const result = {};
    fieldsString.split(' ').map(field => {
        if (prefix) {
            result[prefix + '.' + field] = 1;
        }
        else {
            result[field] = 1;
        }
    });
    return result;
};
exports.getPaginationInfo = (pageNo = 1) => {
    const limit = 20;
    const skip = (pageNo - 1) * limit;
    return { limit, skip };
};
exports.validateMobile = (phone = '') => {
    // const regmm='^([0|+[0-9]{1,5})?([7-9][0-9]{9})$';
    // const regmob = new RegExp(regmm);
    if (phone.length == 12) {
        return true;
    }
    return false;
};
exports.sanatizeMobile = (phone) => {
    phone.replace("+", "");
    if (phone.length == 10)
        return `91${phone}`;
    return phone;
};
exports.deSanatizeMobile = (phone) => {
    phone.replace("+", "");
    if (phone.length == 12)
        return phone.slice(2);
    return phone;
};
//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSkipLimit = exports.validateEmail = exports.deSanatizeMobile = exports.sanatizeMobile = exports.validateMobile = exports.getPaginationInfo = exports.mongoDBProjectFields = exports.applyRoutes = exports.applyMiddleware = void 0;
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
            router[method](path, [auth_middleware_1.Authorization(role), auth_middleware_1.RoleAuthorization(role), ...handler]);
        }
        else if (adminOnly) {
            router[method](path, [auth_middleware_1.Authorization(role), auth_middleware_1.AdminAuthorization, ...handler]);
        }
        else {
            router[method](path, [auth_middleware_1.Authorization(role), ...handler]);
        }
    }
    return router;
};
exports.mongoDBProjectFields = (fieldsString, prefix) => {
    const result = {};
    fieldsString.split(" ").map(field => {
        if (prefix) {
            result[prefix + "." + field] = 1;
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
exports.validateMobile = (phone = "") => {
    return true;
};
exports.sanatizeMobile = (phone) => {
    return phone.replace("+", "");
};
exports.deSanatizeMobile = (phone) => {
    return `+${exports.sanatizeMobile(phone)}`;
};
exports.validateEmail = (email = "") => {
    if (!email.length)
        return false;
    return String(email)
        .toLowerCase()
        .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};
exports.getSkipLimit = (pageNo = 1) => {
    const limit = 10;
    const skip = (pageNo - 1) * limit;
    return { skip, limit };
};
//# sourceMappingURL=index.js.map
const { validationResult } = require('express-validator');

// Uses express validator on our defined rules.
// We the rules must be defined first as middleware before validating, I'm just doing both (Establishing rules and validating)
// in one step, hence why we're returning two middleware in a list in this function
function validate(rules) {
    return [rules, function(req, res, next) {
        const validationErrors = validationResult(req);
        if(!validationErrors.isEmpty()) {
            let errs = {};
            for(validationError of validationErrors.array()) {
                if(validationError.path in errs)
                    errs[validationError.path].push(validationError.msg);
                else
                    errs[validationError.path] = [validationError.msg];
            }

            return res.status(400).send({error: errs});
        }
    
        next();
    }];
}

module.exports = validate;
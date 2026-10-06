// Minimal reproduction of the "error.path.includes is not a function" issue.
//
// A widget that adds its own validation in `sanitize` and throws a single
// `apos.error` (not an array). `@apostrophecms/area:sanitizeItems` then reports
// it with a numeric `path` (the widget index), and
// `@apostrophecms/schema:handleConvertErrors` crashes on `error.path.includes('.')`,
// hiding the original error.
export default {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Sanitize Error (repro)',
    description: 'Throws from sanitize to reproduce the masked error'
  },
  fields: {
    add: {
      label: {
        type: 'string',
        label: 'Label',
        required: true
      },
      throwFromSanitize: {
        type: 'boolean',
        label: 'Throw a single error from sanitize',
        def: true
      }
    }
  },
  extendMethods(self) {
    return {
      async sanitize(_super, req, input, ...rest) {
        const sanitized = await _super(req, input, ...rest);

        if (sanitized.throwFromSanitize) {
          throw self.apos.error('invalid', 'Sanitize error from widget', {
            detail: 'This is the message the editor or the import report should see.'
          });
        }

        return sanitized;
      }
    };
  }
};

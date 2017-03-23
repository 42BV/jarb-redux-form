
import { mostSpecificInputTypeFor, getFieldConstraintsFor } from '../src/utils';

test('mostSpecificInputTypeFor', () => {
  expect(mostSpecificInputTypeFor([])).toBe('text');
  expect(mostSpecificInputTypeFor(['color', 'datetime-local', 'datetime', 'month', 'week', 'date', 'time', 'email', 'tel', 'number', 'url', 'password', 'file', 'image', 'text'])).toBe('color');
  expect(mostSpecificInputTypeFor(['text', 'image', 'file', 'password', 'url', 'number', 'tel', 'email', 'time', 'date', 'week', 'month', 'datetime', 'datetime-local', 'color'])).toBe('color');
  expect(mostSpecificInputTypeFor(['color', 'text'])).toBe('color');
});

test('getFieldConstraintsFor', () => {
  const constraints = {
    "SuperHero": {
      "name": {
        "javaType": "java.lang.String",
        "types": ["text"],
        "required": true,
        "minimumLength": null,
        "maximumLength": 50,
        "fractionLength": null,
        "radix": null,
        "pattern": null,
        "min": null,
        "max": null,
        "name": "name"
      },
      "email": {
        "javaType": "java.lang.String",
        "types": ["email", "text"],
        "required": true,
        "minimumLength": null,
        "maximumLength": 255,
        "fractionLength": null,
        "radix": null,
        "pattern": null,
        "min": null,
        "max": null,
        "name": "email"
      }
    }
  };

  expect(getFieldConstraintsFor('Villain.email', constraints)).toBe(false);
  expect(getFieldConstraintsFor('SuperHero.secrectIdentity', constraints)).toBe(false);

  expect(getFieldConstraintsFor('SuperHero.email', constraints)).toEqual({
    "javaType": "java.lang.String",
    "types": ["email", "text"],
    "required": true,
    "minimumLength": null,
    "maximumLength": 255,
    "fractionLength": null,
    "radix": null,
    "pattern": null,
    "min": null,
    "max": null,
    "name": "email"
  });
});

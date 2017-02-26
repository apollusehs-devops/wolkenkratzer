/**
 * Created by arming on 6/15/16.
 */
'use strict';

const Intrinsic = require('./intrinsic');
const Ref = Intrinsic.Ref;
const FnSub = Intrinsic.FnSub;
const FnGetAtt = Intrinsic.FnGetAtt;
const FnFindInMap = Intrinsic.FnFindInMap;
const FnBase64 = Intrinsic.FnBase64;
const FnJoin = Intrinsic.FnJoin;
const RequiredPropertyException = require(
  './exceptions'
).RequiredPropertyException;
const TypeException = require('./exceptions').TypeException;
const ResourceProperty = require('./resource').ResourceProperty;

/** @module Core */

/**
 * @memberof module:Core
 */
function ResourceAttribute(name, type, isArray, required, value) {
  this.WKName = name;
  this.Type = type;
  this.isArray = isArray;
  this.required = required;
  this.val = value;
}

/**
 * Set the value of the attribute
 * @param value
 */
ResourceAttribute.prototype.set = function(value) {
  if (this.isArray) {
    let instrinsicValue = Intrinsic.makeIntrinsic(value);
    if (instrinsicValue) {
      value = instrinsicValue;
    }
    if (value instanceof Intrinsic.Intrinsic) {
      this.val = value;
    } else if (!Array.isArray(value)) {
      throw new TypeException(
        value + ' is the wrong type, was expecting an array of ' + this.Type
      );
    } else {
      this.val = [];
      for (let val of value) {
        val = new this.Type(val);
        if (
          typeof val === 'string' && this.Type.prototype === String.prototype ||
          typeof val === 'boolean' &&
            this.Type.prototype === Boolean.prototype ||
          typeof val === 'number' && this.Type.prototype === Number.prototype ||
          val instanceof this.Type
        ) {
          this.val.push(val);
        } else {
          throw new TypeException(
            value +
              ' is the wrong type for ' +
              this.WKName +
              ', was expecting ' +
              this.Type
          );
        }
      }
    }
  } else {
    let instrinsicValue = Intrinsic.makeIntrinsic(value);
    if (instrinsicValue) {
      value = instrinsicValue;
    }
    if (value instanceof Intrinsic.Intrinsic) {
      this.val = value;
    } else {
      if (
        typeof value === 'string' && this.Type.prototype === String.prototype ||
        typeof value === 'boolean' &&
          this.Type.prototype === Boolean.prototype ||
        typeof value === 'number' && this.Type.prototype === Number.prototype ||
        value instanceof this.Type
      ) {
        this.val = value;
      } else if (new this.Type(value) instanceof this.Type) {
        this.val = new this.Type(value);
      } else {
        throw new TypeException(
          value +
            ' is the wrong type for ' +
            this.WKName +
            ', was expecting ' +
            this.Type
        );
      }
    }
  }
};

/**
 * Add a value to the attribute array
 * @param val
 */
ResourceAttribute.prototype.push = function(val) {
  if (!this.isArray) {
    throw new TypeException(
      this.WKName + ' is not an array, cannot push ' + val
    );
  }
  let value = val;
  let instrinsicValue = Intrinsic.makeIntrinsic(value);
  if (instrinsicValue) {
    value = instrinsicValue;
  }
  if (
    value instanceof Intrinsic.Intrinsic ||
    typeof value === 'string' && this.Type.prototype === String.prototype ||
    typeof value === 'boolean' && this.Type.prototype === Boolean.prototype ||
    typeof value === 'number' && this.Type.prototype === Number.prototype ||
    value instanceof this.Type
  ) {
    if (!this.val) {
      this.val = [];
    }
    this.val.push(val);
  } else {
    try {
      if (!this.val) {
        this.val = [];
      }
      let newObject = new this.Type(val);
      this.val.push(newObject);
    } catch (e) {
      throw new TypeException(
        val +
          ' is the wrong type, was expecting ' +
          this.Type +
          ', reporting: ' +
          e
      );
    }
  }
};

/**
 * Get the value of the attribute
 * @returns {FnGetAtt|module:Core.FnGetAtt|FnFindInMap|*|Ref|FnJoin}
 */
ResourceAttribute.prototype.get = function() {
  return this.val;
};

/**
 * Add an Fn Ref intrinsic function to link another resource to the attribute
 * @param resource
 */
ResourceAttribute.prototype.ref = function(resource) {
  this.val = new Ref(resource);
};

/**
 * Add an Fn Sub intrinsic function
 * @param resource
 */
ResourceAttribute.prototype.sub = function(input) {
  this.val = new FnSub(input);
};

/**
 * Add an Fn GetAtt intrinsic function to link the attribute of another resource to the attribute
 * @param resource
 * @param attribute
 */
ResourceAttribute.prototype.getAtt = function(resource, attribute) {
  this.val = new FnGetAtt(resource, attribute);
};

/**
 * Add a Fn FindInMap intrinsic function to set the value of the attribute
 * @param map
 * @param top
 * @param second
 */
ResourceAttribute.prototype.findInMap = function(map, top, second) {
  this.val = new FnFindInMap(map, top, second);
};

/**
 * Add an Fn Join intrinsic function to set the value of the attribute
 * @param delimiter
 * @param values
 */
ResourceAttribute.prototype.join = function(delimiter, values) {
  this.val = new FnJoin(delimiter, values);
};

/**
 * Add an Fn Base64 intrinsic function to set the value of the attribute
 * @param content
 */
ResourceAttribute.prototype.base64 = function(content) {
  this.val = new FnBase64(content);
};

/**
 * Get a JSON representation of the attribute
 * @returns {*}
 */
ResourceAttribute.prototype.toJson = function() {
  let errors = [];
  if (this.isArray) {
    if (this.val !== null) {
      if (this.val instanceof Intrinsic.Intrinsic) {
        let result = this.val.toJson();
        if (result.errors) {
          result.errors.forEach(e => {
            errors.push(e);
          });
        }
        return { errors: errors, json: result.json };
      } else if (this.Type.prototype instanceof ResourceProperty) {
        let propArray = [];
        for (let prop in this.val) {
          let result = this.val[prop].toJson();
          if (result.errors) {
            result.errors.forEach(e => {
              errors.push(e);
            });
          }
          if (result.json != null) {
            propArray.push(result.json);
          }
        }
        if (propArray.length > 0) {
          return { errors: errors, json: propArray };
        }
      } else {
        let propArray = [];
        for (let prop in this.val) {
          if (this.val[prop] instanceof Intrinsic.Intrinsic) {
            let result = this.val[prop].toJson();
            if (result.errors) {
              result.errors.forEach(e => {
                errors.push(e);
              });
            }
            if (result.json != null) {
              propArray.push(result.json);
            }
          } else {
            propArray.push(this.val[prop]);
          }
        }
        if (propArray.length > 0) {
          return { errors: errors, json: propArray };
        }
      }
    } else {
      if (this.required === 'Yes') {
        errors.push(this.WKName + ' is required.');
        return { errors: errors, json: null };
      } else {
        return { errors: null, json: null };
      }
    }
  } else {
    if (this.val !== null) {
      if (
        this.val instanceof Intrinsic.Intrinsic ||
        this.val instanceof ResourceProperty
      ) {
        let result = this.val.toJson();
        if (result.errors) {
          result.errors.forEach(e => {
            errors.push(e);
          });
        }
        return { errors: errors, json: result.json };
      }
      let jsonValue = this.val;
      return { errors: errors, json: jsonValue };
    } else {
      if (this.required === 'Yes') {
        errors.push(this.WKName + ' is required.');
        return { errors: errors, json: null };
      } else {
        return { errors: null, json: null };
      }
    }
  }
};

module.exports = {
  ResourceAttribute: ResourceAttribute
};
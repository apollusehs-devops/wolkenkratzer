'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.







Mapping = Mapping;function Mapping(
name,
subName,
body)
{
  if (!name || !subName || !body) {
    throw new SyntaxError(
    `New Mapping with ${JSON.stringify({
      name,
      subName,
      body })
    } parameters is invalid. name, subName, and body are required.`);

  }
  return { kind: 'Mapping', Name: name, Content: { [subName]: body } };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbGVtZW50cy9tYXBwaW5nLmpzIl0sIm5hbWVzIjpbIk1hcHBpbmciLCJuYW1lIiwic3ViTmFtZSIsImJvZHkiLCJTeW50YXhFcnJvciIsIkpTT04iLCJzdHJpbmdpZnkiLCJraW5kIiwiTmFtZSIsIkNvbnRlbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBUWdCQSxPLEdBQUFBLE8sQ0FBVCxTQUFTQSxPQUFUO0FBQ0xDLElBREs7QUFFTEMsT0FGSztBQUdMQyxJQUhLO0FBSUs7QUFDVixNQUFJLENBQUNGLElBQUQsSUFBUyxDQUFDQyxPQUFWLElBQXFCLENBQUNDLElBQTFCLEVBQWdDO0FBQzlCLFVBQU0sSUFBSUMsV0FBSjtBQUNILHdCQUFtQkMsS0FBS0MsU0FBTCxDQUFlO0FBQ2pDTCxVQURpQztBQUVqQ0MsYUFGaUM7QUFHakNDLFVBSGlDLEVBQWY7QUFJakIsbUVBTEMsQ0FBTjs7QUFPRDtBQUNELFNBQU8sRUFBRUksTUFBTSxTQUFSLEVBQW1CQyxNQUFNUCxJQUF6QixFQUErQlEsU0FBUyxFQUFFLENBQUNQLE9BQUQsR0FBV0MsSUFBYixFQUF4QyxFQUFQO0FBQ0QiLCJmaWxlIjoibWFwcGluZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmV4cG9ydCBpbnRlcmZhY2UgSU1hcHBpbmcge1xuICAra2luZDogJ01hcHBpbmcnLFxuICArTmFtZTogc3RyaW5nLFxuICArQ29udGVudDogeyBbc3RyaW5nXTogbWl4ZWQgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gTWFwcGluZyhcbiAgbmFtZTogc3RyaW5nLFxuICBzdWJOYW1lOiBzdHJpbmcsXG4gIGJvZHk6IHsgW3N0cmluZ106IG1peGVkIH1cbik6IElNYXBwaW5nIHtcbiAgaWYgKCFuYW1lIHx8ICFzdWJOYW1lIHx8ICFib2R5KSB7XG4gICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKFxuICAgICAgYE5ldyBNYXBwaW5nIHdpdGggJHtKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIG5hbWUsXG4gICAgICAgIHN1Yk5hbWUsXG4gICAgICAgIGJvZHlcbiAgICAgIH0pfSBwYXJhbWV0ZXJzIGlzIGludmFsaWQuIG5hbWUsIHN1Yk5hbWUsIGFuZCBib2R5IGFyZSByZXF1aXJlZC5gXG4gICAgKTtcbiAgfVxuICByZXR1cm4geyBraW5kOiAnTWFwcGluZycsIE5hbWU6IG5hbWUsIENvbnRlbnQ6IHsgW3N1Yk5hbWVdOiBib2R5IH0gfTtcbn1cbiJdfQ==
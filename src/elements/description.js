// @flow

export interface IDescription {
  +kind: 'Description',
  +Content: string
}

export function Description(content: string): IDescription {
  if (!content) {
    throw new SyntaxError(`New Description must have content.`);
  }
  return { kind: 'Description', Content: content };
}
import crypto from 'crypto';

export type GUID = `${string}-${string}-${string}-${string}` & { __brand: 'guid' };

export const NIL_GUID: GUID = '00000000-00000000-00000000-00000000' as GUID;

export const generateGUID = (): GUID => {
  return crypto
    .randomBytes(16)
    .toString('hex')
    .replace(/(.{8})(.{8})(.{8})(.{8})/g, '$1-$2-$3-$4') as GUID;
};

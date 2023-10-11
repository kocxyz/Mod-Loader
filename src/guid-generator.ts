import crypto from 'crypto';

export type GUID = `${string}-${string}-${string}-${string}` & { __brand: 'guid' };

/**
 * A zerofilled GUID.
 */
export const NIL_GUID: GUID = '00000000-00000000-00000000-00000000' as GUID;

/**
 * Generate a random GUID for Knockout City.
 *
 * @returns The generated GUID
 */
export const generateGUID = (): GUID => {
  return crypto
    .randomBytes(16)
    .toString('hex')
    .replace(/(.{8})(.{8})(.{8})(.{8})/g, '$1-$2-$3-$4') as GUID;
};

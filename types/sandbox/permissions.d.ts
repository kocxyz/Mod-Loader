declare module 'permissions' {
  namespace permissions {
    /**
     * Check if a certain permission is granted.
     *
     * @param value The permission name.
     *
     * @returns Wheather the the permission is granted or not.
     */
    function hasPermission(value: import('../../dist/types/permissions').ModPermission): boolean;
  }

  export default permissions;
}

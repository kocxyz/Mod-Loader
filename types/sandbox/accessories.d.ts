declare module 'accessories' {
  namespace accessories {
    /**
     * Add a new Player Icon to the Game.
     *
     * @param guid A new GUID for the Item.
     * @param name The name of the Player Icon.
     * @param rarity The rarity if the Player Icon.
     * @param icon The Icon asset.
     * @param inInitialInventory If the item should be available for everyone.
     */
    function addPlayerIcon(
      guid: `${string}-${string}-${string}-${string}`,
      name: string,
      rarity: string,
      icon: { path: string; extension: string },
      inInitialInventory?: boolean
    ): string;
  }

  export default accessories;
}

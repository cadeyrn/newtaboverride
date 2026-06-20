'use strict';

class PermissionHelper {
  /**
   * This method is used to set up the listeners for granting and revoking a permission.
   *
   * @param {object} obj - an object containing the permission and the DOM elements for the
   * permission actions
   *
   * @returns {void}
   */
  static setupListeners (obj) {
    obj.$grantBtn.addEventListener('click', e => {
      PermissionHelper.#requestPermission(
        e,
        obj.permission,
        obj.$grantPermissionContainer,
        obj.$revokePermissionContainer
      );
    });

    obj.$revokeBtn.addEventListener('click', e => {
      PermissionHelper.#revokePermission(
        e,
        obj.permission,
        obj.$grantPermissionContainer,
        obj.$revokePermissionContainer
      );
    });
  }

  /**
   * Checks if the requested permission is granted. If so it shows the option to revoke the permission.
   * Otherwise, it shows the option to grant the permission.
   *
   * @param {object} permission - the permission object
   * @param {HTMLElement} $permission - the DOM element containing the UI for granting the permission
   * @param {HTMLElement} $permissionRevoke - the DOM element containing the UI for revoking the permission
   *
   * @returns {void}
   */
  static async testPermission (permission, $permission, $permissionRevoke) {
    const isAllowed = await browser.permissions.contains(permission);

    if (isAllowed) {
      $permissionRevoke.classList.remove('hidden');
    }
    else {
      $permission.classList.remove('hidden');
    }
  }

  /**
   * This method is used to request and to grant a permission.
   *
   * @param {Event} e - event
   * @param {object} permission - the permission object
   * @param {HTMLElement} $permission - the DOM element containing the UI for granting the permission
   * @param {HTMLElement} $permissionRevoke - the DOM element containing the UI for revoking the permission
   *
   * @returns {void}
   */
  static async #requestPermission (e, permission, $permission, $permissionRevoke) {
    e.preventDefault();

    const granted = await browser.permissions.request(permission);

    if (granted) {
      $permission.classList.add('hidden');
      $permissionRevoke.classList.remove('hidden');
    }
  }

  /**
   * This method is used to revoke a permission.
   *
   * @param {Event} e - event
   * @param {object} permission - the permission object
   * @param {HTMLElement} $permission - the DOM element containing the UI for granting the permission
   * @param {HTMLElement} $permissionRevoke - the DOM element containing the UI for revoking the permission
   *
   * @returns {void}
   */
  static async #revokePermission (e, permission, $permission, $permissionRevoke) {
    e.preventDefault();

    const revoked = await browser.permissions.remove(permission);

    if (revoked) {
      $permission.classList.remove('hidden');
      $permissionRevoke.classList.add('hidden');
    }
  }
}

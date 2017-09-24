'use strict';

/**
 * @exports permissions
 */
const permissions = {
  /**
   * This method is used to set up the listeners for granting and revoking a permission.
   *
   * @param {Object} obj - an object containing the permission and the needed DOM elements for the permission actions
   *
   * @returns {void}
   */
  setupListeners (obj) {
    obj.elGrantBtn.addEventListener('click', function (e) {
      permissions.requestPermission(e, obj.permission, obj.elGrantPermissionContainer, obj.elRevokePermissionContainer);
    });

    obj.elRevokeBtn.addEventListener('click', function (e) {
      permissions.revokePermission(e, obj.permission, obj.elGrantPermissionContainer, obj.elRevokePermissionContainer);
    });
  },

  /**
   * Checks if the requested permission is granted. If so it shows the option to revoke the permission.
   * Otherwise it shows the option to grant the permission.
   *
   * @param {Object} permission - the permission object
   * @param {HTMLElement} elPermission - the DOM element containing the UI for granting the permission
   * @param {HTMLElement} elPermissionRevoke - the DOM element containing the UI for revoking the permission
   *
   * @returns {void}
   */
  async testPermission (permission, elPermission, elPermissionRevoke) {
    const isAllowed = await browser.permissions.contains(permission);

    if (isAllowed) {
      elPermissionRevoke.classList.remove('hidden');
    }
    else {
      elPermission.classList.remove('hidden');
    }
  },

  /**
   * This method is used to request and to grant a permission.
   *
   * @param {Event} e - event
   * @param {Object} permission - the permission object
   * @param {HTMLElement} elPermission - the DOM element containing the UI for granting the permission
   * @param {HTMLElement} elPermissionRevoke - the DOM element containing the UI for revoking the permission
   *
   * @returns {void}
   */
  async requestPermission (e, permission, elPermission, elPermissionRevoke) {
    e.preventDefault();

    const granted = await browser.permissions.request(permission);

    if (granted) {
      elPermission.classList.add('hidden');
      elPermissionRevoke.classList.remove('hidden');
    }
  },

  /**
   * This method is used to revoke a permission.
   *
   * @param {Event} e - event
   * @param {Object} permission - the permission object
   * @param {HTMLElement} elPermission - the DOM element containing the UI for granting the permission
   * @param {HTMLElement} elPermissionRevoke - the DOM element containing the UI for revoking the permission
   *
   * @returns {void}
   */
  async revokePermission (e, permission, elPermission, elPermissionRevoke) {
    e.preventDefault();

    const revoked = await browser.permissions.remove(permission);

    if (revoked) {
      elPermission.classList.remove('hidden');
      elPermissionRevoke.classList.add('hidden');
    }
  }
};

/**
 * Account routes: self-service profile and bookmark endpoints for the
 * signed-in user. Access is granted per role in src/index.ts; there is no
 * public access. These exist because the stock PUT /api/users/:id has no
 * ownership check and would let a user change their own role.
 */
export default {
  routes: [
    {
      method: "GET",
      path: "/account/me",
      handler: "account.me",
      config: { policies: [] },
    },
    {
      method: "PUT",
      path: "/account/profile",
      handler: "account.updateProfile",
      config: { policies: [] },
    },
    {
      method: "POST",
      path: "/account/bookmarks/:kind/:documentId",
      handler: "account.addBookmark",
      config: { policies: [] },
    },
    {
      method: "DELETE",
      path: "/account/bookmarks/:kind/:documentId",
      handler: "account.removeBookmark",
      config: { policies: [] },
    },
  ],
};

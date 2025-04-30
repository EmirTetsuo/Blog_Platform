export const pathKeys = {
  root: '/',
  home() {
    return pathKeys.root
  },
  dashboard() {
    return pathKeys.root + 'dashboard';
  },
  login() {
    return pathKeys.root + 'login';
  },
  register() {
    return pathKeys.root + 'register';
  },
  updateUser() {
    return pathKeys.root + 'update_user';
  },
  error() {
    return pathKeys.root.concat('*')
  },
  posts: {
    root() {
      return pathKeys.root + 'posts';
    },

    new() {
      return pathKeys.posts.root() + '/new';
    },

    byId(id) {
      return pathKeys.root + 'post/' + id;
    },

    editById(id) {
      return pathKeys.root + 'post/' + id + '/edit';
    }
  },
}

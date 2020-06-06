import Octokat from 'octokat';

var defaults = {
  branchName: 'master',
};

function init(options: any) {
  options = Object.assign({}, defaults, options);
  var head: any;

  var octo = new Octokat({
    token: options.token,
  });
  var repo = octo.repos(options.username, options.reponame);

  function fetchHead() {
    return repo.git.refs.heads(options.branchName).fetch();
  }

  function fetchTree() {
    return fetchHead().then(function (commit: any) {
      head = commit;
      return repo.git.trees(commit.object.sha).fetch();
    });
  }

  function commit(files: any, message: any) {
    return Promise.all(
      files.map(function (file: any) {
        return repo.git.blobs.create({
          content: file.content,
          encoding: 'utf-8',
        });
      })
    )
      .then(function (blobs: any) {
        return fetchTree().then(function (tree: any) {
          return repo.git.trees.create({
            tree: files.map(function (file: any, index: any) {
              return {
                path: file.path,
                mode: '100644',
                type: 'blob',
                sha: blobs[index].sha,
              };
            }),
            basetree: tree.sha,
          });
        });
      })
      .then(function (tree) {
        return repo.git.commits.create({
          message: message,
          tree: tree.sha,
          parents: [head.object.sha],
        });
      })
      .then(function (commit) {
        return repo.git.refs.heads(options.branchName).update({
          sha: commit.sha,
        });
      });
  }

  return {
    commit: commit,
  };
}

export default init;

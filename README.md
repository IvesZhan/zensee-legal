# ZenSee Web

This directory is the root of the ZenSee Web project. It can be published directly as a GitHub Pages site and currently contains the legal pages, download pages, and public group share pages.

## Recommended setup

Use a dedicated GitHub repository, for example:

- `zensee-web`

Then upload the contents of this folder to the root of that repository.

## Repository structure

- `privacy-policy/index.html`
- `terms-of-service/index.html`
- `support/index.html`
- `download/index.html`
- `download/en/index.html`
- `download/zh-hant/index.html`
- `download/ja/index.html`
- `group/index.html`
- `group/en/index.html`
- `group/zh-hant/index.html`
- `group/ja/index.html`
- `wechat-sdk/index.html`
- `.well-known/apple-app-site-association`
- `apple-app-site-association`
- `.nojekyll`

## Asset conventions

Static images are managed under `assets/images/`:

- `assets/images/brand/`: brand icon and favicon
- `assets/images/screens/`: product screenshots used by homepage and download pages
- `assets/images/editorial/`: decorative and atmosphere images used by marketing sections

Keep new image files inside these folders instead of placing them in the project root or under individual page folders.

## Enable GitHub Pages

In the target repository on GitHub:

1. Open `Settings`
2. Open `Pages`
3. Under `Build and deployment`
4. Set `Source` to `Deploy from a branch`
5. Set branch to `main`
6. Set folder to `/(root)`
7. Click `Save`

## Final URL formats

If the repository is a project site repo such as `zensee-web`:

- `https://<github-username>.github.io/zensee-web/privacy-policy/`
- `https://<github-username>.github.io/zensee-web/terms-of-service/`
- `https://<github-username>.github.io/zensee-web/support/`
- `https://<github-username>.github.io/zensee-web/download/`
- `https://<github-username>.github.io/zensee-web/download/en/`
- `https://<github-username>.github.io/zensee-web/download/zh-hant/`
- `https://<github-username>.github.io/zensee-web/download/ja/`
- `https://<github-username>.github.io/zensee-web/group/?id=<group-uuid>`
- `https://<github-username>.github.io/zensee-web/group/en/?id=<group-uuid>`
- `https://<github-username>.github.io/zensee-web/group/zh-hant/?id=<group-uuid>`
- `https://<github-username>.github.io/zensee-web/group/ja/?id=<group-uuid>`

If the repository is a user site repo such as `<github-username>.github.io`:

- `https://<github-username>.github.io/privacy-policy/`
- `https://<github-username>.github.io/terms-of-service/`
- `https://<github-username>.github.io/support/`
- `https://<github-username>.github.io/download/`
- `https://<github-username>.github.io/download/en/`
- `https://<github-username>.github.io/download/zh-hant/`
- `https://<github-username>.github.io/download/ja/`
- `https://<github-username>.github.io/group/?id=<group-uuid>`
- `https://<github-username>.github.io/group/en/?id=<group-uuid>`
- `https://<github-username>.github.io/group/zh-hant/?id=<group-uuid>`
- `https://<github-username>.github.io/group/ja/?id=<group-uuid>`

## Notes

- `.nojekyll` is included so the static files are served directly.
- The pages use relative links, so both repository URL styles above will work.
- The public group page depends on shared Supabase RPC definitions maintained in `/Users/ives/Desktop/Program/ZenSee/Supabase/sql/group_public_share_hotfix.sql`.
- After renaming the GitHub repository from `zensee-legal` to `zensee-web`, update the Git remote URL if you want local pushes to use the new repository name directly.

## Universal Links

GitHub Pages can be used for Apple Universal Links, but the AASA file must be reachable from the domain root:

- `https://<domain>/.well-known/apple-app-site-association`
- or `https://<domain>/apple-app-site-association`

This means:

- the current project-site URL style `https://<username>.github.io/zensee-web/...` cannot host the AASA file by itself
- you must either publish these files from the user-site root repo `https://<username>.github.io/...`
- or bind a custom domain directly to this site so the repository is served from the domain root

The AASA files in this folder are prepared for the current iOS app:

- Team ID: `L7U6Z557S6`
- Bundle ID: `com.yuzhan.zenseeapp`
- shared group path: `/zensee-web/group/*`
- WeChat SDK callback path: `/wechat-sdk/*`

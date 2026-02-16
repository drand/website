# Website changes

The drand documentation is now hosted here: https://github.com/drand/drand-docs
Using Docusaurus and with more up-to-date informations.

You can find the documentation online here: https://docs.drand.love/

Please open issues there about the docs from now on.

---

# drand documentation

Welcome to the drand documentation website! The live site can be found at https://drand.love.

## Project set up

If you want to build this site locally, run the following:

1. Clone this repository:

   ```bash
   git clone https://github.com/drand/website.git
   ```

1. Move into the `website` folder and install the npm dependencies:

   ```bash
   cd website
   npm install
   ```

1. Boot up the application in _dev mode_:

   ```bash
   npm start
   ```

1. Open [localhost:8084](http://localhost:8084) in your browser.
1. Close the local server with `CTRL` + `c`.
1. To restart the local server, run `npm start` from within the `website` folder.

_Note_: You'll need to use NodeJS version 16, e.g. 16.19.1. At the moment, NodeJS 18 or newer is not supported.

## Creating a blog post

The blog is now on our Docusaurus docs site:  https://github.com/drand/drand-docs

## Deployment to drand.love
Commits on master automatically deploy the updated website to https://drand.love using Cloudflare Pages.  Commits on side branches provide a preview build.  

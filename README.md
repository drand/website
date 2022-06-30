# Drand documentation

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

1. Open [localhost:8080](http://localhost:8080) in your browser.
1. Close the local server with `CTRL` + `c`.
1. To restart the local server, run `npm start` from within the `website` folder.

## Creating a blog post

1. Within the `/docs/blog` directory, create a new markdown document for the blog post. It should be the date of the post as `YYYY-MM-DD` followed by the post title in `kebab-case` and finally the extension `.md`. So, a post called _Bill and Teds Excellent Randomness Protocol_ created on Monday 25th May 2020 would look like `/docs/blog/2020-05-25-bill-and-teds-excellent-randomness-protocol.md`.
1. If you need to add images into your post, first copy and paste them into the blog folder. Then reference them within your post using `[Image caption](./image-name.png)`.
2. Before you write the post, add the following meta data using YAML front matter:
      ```md
      ---
      title: The title of your blog post, note you do not need to repeat this in the post content
      summary: A short summary of the blog post for display in the post index page.
      date: 2020-08-10
      tags:
         - Grouping
         - Tags
         - Relevant
         - To
         - The
         - Post
      ---
      ```

Always test that you blog post is displaying correctly before merging anything into `master`.

## Deployment to drand.love
Commits on master automatically deploy the updated website to https://drand.love using [Fleek](https://fleek.co/).  Commits on side branches provide a preview build in their `fleek/build` check.  
See [this entry](https://docs.fleek.co/hosting/site-deployment/) in Fleek's documentation for more details on how that happens.
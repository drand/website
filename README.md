# Drand documentation

Welcome to the Drand documentation website! We're sorry, but there's no much to see right now. We're in the process of building and writing, so we'll have something for you soon. In the meantime you can check out the [Drand GitHub repository](https://github.com/drand/drand) for more info.

## Project set up

If you want to build this site locally, run the following:

1. Clone this repository:

   ```bash
   git clone https://github.com/drand/website.git
   ```

1. Move into the `website` folder and install the NPM dependencies:

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

There are two steps to creating a post for the Drand site:

1. Content management
1. Sidebar management

### Content management

1. Within the `/docs/blog` directory, create a new folder for you blog post. It should be the date of the post in `YYYYMMDD` followed by the post title in `kebab-case`. So a post called _Bill and Teds Excellent Randomness Protocol_ created on Monday 25th May 2020 would look like `/docs/blog/20200525-bill-and-teds-excellent-randomness-protocol`.
1. Within the folder you just created, make a file called `README.md` and write your blog post in there.
1. If you need to add images into your post, first copy and paste them into the post folder. Then reference them within your post using `[Image caption](./image-name.png)`.

### Sidebar management

1. Open `/.vuepress/config.js` and find the `sidebar` object within `module.exports`:

   ```javascript
   nav: require('./nav/en'),
           sidebar: [
           {
               title: 'Concepts',
               path: '/concepts/',
               collapsable: false,
               children: [
           {
   ```

1. Within that object, find the object with the `title` of `Blog`:

   ```javascript
   {
       title: 'Blog',
       path: '/blog/',
       collapsable: true,
       children: [
           '/blog/20200521-test-blog-post/',
       ]
   }
   ```

1. Within the `children` object add another string into the array with the path of your blog post folder:

   ```javascript
   children: [
       '/blog/20200521-test-blog-post/',
       '/blog/20200525-bill-and-teds-excellent-randomness-protocol/`
   ]
   ```

   The order of the `children` array is the order in which the posts will be displayed in the sidebar. Make sure to include the trailing comma `,` at the end of your array item.

Always test that you blog post is displaying correctly before merging anything into `master`.

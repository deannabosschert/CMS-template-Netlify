const yaml = require("js-yaml");
const {
  DateTime
} = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier");

module.exports = function (eleventyConfig) {
  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  // human readable date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, {
      zone: "utc"
    }).toFormat(
      "dd LLL yyyy"
    );
  });

  // Syntax Highlighting for Code blocks
  eleventyConfig.addPlugin(syntaxHighlight);

  // To Support .yaml Extension in _data
  // You may remove this if you can use JSON
  eleventyConfig.addDataExtension("yaml", (contents) =>
    yaml.safeLoad(contents)
  );


  // Copy Static Files to /_Site
  eleventyConfig.addPassthroughCopy({
    "./src/admin/config.yml": "./admin/config.yml",
    "./node_modules/alpinejs/dist/cdn.min.js": "./static/js/alpine.js",
    "./node_modules/prismjs/themes/prism-tomorrow.css": "./static/css/prism-tomorrow.css",
  });

  // Copy Assets Folder to /_site
  eleventyConfig.addPassthroughCopy('assets/css')
  eleventyConfig.addPassthroughCopy('assets/images/generic')
  eleventyConfig.addPassthroughCopy('assets/images/uploads')


  // Copy favicon to route of /_site
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");


  // let tagsArray = []

  // eleventyConfig.addCollection("allePages", async function (collectionApi) {
  //   let allTags = await getAllTags(collectionApi).sort()
  //   let losseTags = allTags.map(function (tag) {
  //     console.log(tag)
  //     console.log('tag')
  //     addCollectionPerTag(collectionApi, tag)
  //     return addCollectionPerTag
  //   })
  //   // console.log(losseTags)
  //   return losseTags
  // });


// HET PROBLEEM LIGT BIJ /ontdek-curacao/collection

  // function getAllTags(collectionApi) {
  //   let getTags = []
  //   let alles = collectionApi.getAll()

  //   alles.forEach(function (item) {
  //    getTags.push(item.data.tags)
  //   })
  //   let uniqueTags = [...new Set(getTags.flat().sort())]
  //   tagsArray.push(uniqueTags)
   
  //   tagsArray.flat()
  //   return tagsArray.flat()
  // }

  // function addCollectionPerTag(tag, collectionApi) {
  //   console.log('testttttt')
  //   console.log(tag)
  //   if (tag !== 'bezienswaardigheden') {
  //     console.log(collectionApi.getFilteredByTag(tag))
  //     // Get only content that matches a tag and add it to a collection if it doesn't exist already
  //   eleventyConfig.addCollection(tag, function (collectionApi) {
  //     console.log('tag gevonden')
  //     return collectionApi.getFilteredByTag(tag)
  //   })
  //   }
  //   // console.log(collectionApi.getFilteredByTag(tag).map(function (item) {return item.data.tags}).flat())
    
  // }




  // Minify HTML
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    // if (outputPath.endsWith(".html")) {
    // EDIT: only for .html files outside of the `posts` directory
    if (outputPath.endsWith(".html") && !outputPath.includes("posts")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }

    return content;
  });

  // Let Eleventy transform HTML files as nunjucks
  // So that we can use .html instead of .njk
  return {
    dir: {
      input: "src",
      data: "_data"
    },
    htmlTemplateEngine: "njk",
  };
};
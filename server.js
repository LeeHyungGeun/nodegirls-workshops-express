var express = require('express');
var formidable = require('express-formidable');
var mustacheExpress = require('mustache-express');
var marked = require('marked-engine');
var fs = require('fs');
var app = express();

// mustache engine
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');

// markdown engine
// app.engine('md', require('marked-engine').renderFile);
// app.set('view engine', 'md');

app.set('views', __dirname + '/views');

app.use(express.static("public"));
app.use(formidable());

app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.get("/chocolate", function (req, res) {
  res.send("Mm chocolate :0");
});
app.get("/node", function (req, res) {
  res.send("Node");
});
app.get("/girls", function (req, res) {
  res.send("Girls");
});
app.post('/create-post', function (req, res) {
  fs.readFile(__dirname + '/data/posts.json', function (err, file) {
    var parsedFile = JSON.parse(file);
    parsedFile[Date.now()] = req.fields.blogpost;
    fs.writeFile(__dirname + '/data/posts.json', JSON.stringify(parsedFile), function (err) {
      // res.sendFile(__dirname + '/data/posts.json');
      res.redirect('/posts');
    });
  });
})
app.get('/get-posts', function (req, res) {
  res.sendFile(__dirname + '/data/posts.json');
});
app.get('/posts', function (req, res) {
  fs.readFile(__dirname + '/data/posts.json', function (err, file) {
    var posts = JSON.parse(file);
    var aposts = [];
    for (var key in posts) {
      aposts.push({
        key,
        value: posts[key]
      });
    }
    res.render('posts', { posts: aposts }); 
  });
});
app.get('/posts/:postId', function (req, res) {
  // fs.readFile(__dirname + '/data/posts.json', function (err, file) {
  //   var parsedFile = JSON.parse(file);
  //   var postContent = parsedFile[req.params.postId];
  //   res.render('post', { post: postContent });
  // });
  fs.readFile(__dirname + '/data/posts.json', function (err, file) {
    var parsedFile = JSON.parse(file);
    var postContent = parsedFile[req.params.postId];
    marked.render(postContent, function (err, str) {
      res.send(str);
    });
  });
});

app.listen(3000, function () {
  console.log('Server is listening on port 3000. Ready to accept requests!');
});
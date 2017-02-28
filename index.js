/**
 * Created by Administrator on 2016/9/12.
 */
var express = require("express");
var path = require('path');
var mongoose = require('mongoose');
var _ = require('underscore');
var Movie = require('./models/movie');
var port = process.env.PORT || 3000;
var app = express();


mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/movies");

app.use(require('body-parser').urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'bower_components')));//静态文件配置的目录
app.set('views','./views/pages');
app.set('view engine','pug');
app.locals.moment = require('moment')
app.listen(port);

console.log('imooc start:'+ port);

//首页
app.get('/',function(req,res){
    Movie.fetch(function (err, movies) {
        if(err){
            console.log(err);
        }
        res.render('index',{
            title:'分享电影首页',
            movies: movies
        });
    })

} );

//详情页
app.get('/movie/:id', function(req, res) {
    var id = req.params.id;
	console.log(id);
    Movie.findById(id,function (err, movie) {
        if(err){
            console.log(err);
        }
        res.render('detail', {
            title: 'imooc ' + movie.title,
            movie: movie
        })
    })
})


//管理员功能模块>>>
//更新和添加公用一个模板
app.get('/admin/movie', function(req, res) {
    res.render('admin', {
        title: '后台录入页',
        movie: {
            title: '',
            doctor: '',
            country: '',
            year: '',
            poster: '',
            flash: '',
            summary: '',
            language: ''
        }
    })
})

//更新模板
app.get('/admin/update/:id',function (req, res) {
    var id= req.params.id;

    if (id) {
        Movie.findById(id, function (err,movie) {
            res.render('admin',{
                title:'后台更新页',
                movie:movie
            })

        })
    }
})

//添加模板
app.post('/admin/movie/new',function (req, res) {
    var id = req.body.movie._id;
	
    var movieObj = req.body.movie;
	
	
    var _movie ;
	//存在id是更新模块部分，更新完就redirect
    if(id!==undefined && id !== "" && id !== null){
        Movie.findById(id,function (err,movie) {
            if (err) {
                console.log(err);
            }
            _movie = _.extend(movie, movieObj);
            _movie.save(function (err,movie) {
                if (err){
                    console.log(err);
                }

                res.redirect('/movie/' + movie._id)
            })
        })
    }else{
		//id为空，是添加模块，当没有id时就save
        _movie = new Movie({
            doctor:movieObj.doctor,
            title:movieObj.title,
            country:movieObj.country,
            language:movieObj.language,
            year:movieObj.year,
            poster:movieObj.poster,
            summary:movieObj.summary,
            flash:movieObj.flash
        });

        _movie.save(function (err,movie) {
            if (err){
                console.log(err);
            }

            res.redirect('/movie/' + movie._id)
        })
    }
});


//列表页>>>
app.get('/admin/list', function(req, res) {
    Movie.fetch(function (err, movies) {
        if(err){
            console.log(err);
        }
        res.render('list',{
            title:'列表页',
            movies: movies
        });
    });
});
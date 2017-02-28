/**
 * Created by Administrator on 2016/9/13.
 */
var mongoose = require('mongoose');
var MovieSchema = require("../schemas/movie");
var Movie = mongoose.model('Movie',MovieSchema);

module.exports = Movie;

var cheerio = require("cheerio");
var async = require("async");
var fs = require('fs');

var arrayFile = ['smile_people.html','animals_nature.html','food_drink.html','activity.html','travel_places.html',
                  'objects.html','symbols.html','flags.html','diversity.html'];

var jsonObject = '{';
async.each(arrayFile,
  // 2nd param is the function that each item is passed to
  function(item, callback){
    
    //Read the category's file
    nameCategory = item.replace('.html','');
    //console.log(nameCategory);
    jsonObject += '"'+nameCategory+'":[';

    var data = fs.readFileSync(item,'utf8');
    var $ = cheerio.load(data);

      $(".e1js-lightbox").each(function() {
          var node = $(this);
          var nameImage= node.attr('data-unicode');
          var titleImage= node.attr('data-title');
          jsonObject += '{"name": "' + titleImage + '","path":"png/' + nameImage+ '.png"},';    
      });

    jsonObject = jsonObject.substring(0,jsonObject.length-1);
    jsonObject += "],";
    callback();
  },
  // 3rd param is the function to call when everything's done
  function(err){
    //Strip last char 
    jsonObject = jsonObject.substring(0,jsonObject.length-1);
    jsonObject += '}';

    fs.writeFile("wemoji.json",jsonObject,function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("File Saved");
    });
  }
);
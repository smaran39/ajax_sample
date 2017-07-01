
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // YOUR CODE GOES HERE!
    var $streetStr= $('#street').val();
    var $cityStr = $('#city').val();
    var address = $streetStr + ',' + $cityStr;

    var imgSrc= 'http://maps.googleapis.com/maps/api/streetview?size=600x300&location='+address+'';
    $body.append('<img class="bgimg" src="'+ imgSrc +'">');

    //NYTimes AJAX request 
    var nyturl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    nyturl += '?' + $cityStr + '&sort=newest&api-key=4ae0efdb23764e43a4b1e347174b2ac0';

    /*$.param({
        'api-key': "4ae0efdb23764e43a4b1e347174b2ac0"
    });*/


    $.getJSON(nyturl,function(data){
        //console.log(data);
        $nytHeaderElem.text('New York Times Articles About '+ $cityStr);

        var articles = [];
        articles = data.response.docs;
        for(var i=0;i<articles.length;i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">'+ '<a href="' + article.web_url + '">' + article.headline.main +'</a>'+
                '<p>'+article.snippet+'</p>'+'</li>');
        }


    }).error(function(e){        //chaining of methods
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded!');
       // console.log(e);
    });

    //wikipedia AJAX requests 

    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='+ $cityStr+
                '&format=json&callback=wikiCallback';

    //for error-handling of JSONP. There is no built-in error handling method for JSONP

    var wikiRequestTimeOut = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources");
    },8000); // this statement sets the timer ON
    
    $.ajax({
        url: wikiUrl,
        dataType:"jsonp",
        //jsonp:"callback",
        success: function(response){
            var articleList = response[1]; //check the response in the Network tab of developer tools in the browser

            for(var i=0;i<articleList.length;i++){
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/'+ articleStr;
                $wikiElem.append('<li><a href="' + url + '">'+
                    articleStr + '</a></li>');
            };

            clearTimeout(wikiRequestTimeOut); //stops the timer once this statement is executed
        }
    });                

    return false;
};

$('#form-container').submit(loadData);

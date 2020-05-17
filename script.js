//1. fx for oneDay
$(document).ready(function () {
  //fiveday("austin");
  var apikey="7b866cf1c2449cde360219a43c1dc318";
fiveday("austin");
oneDay("austin");

  renderBtn();
  var date=moment().format('dddd, MMMM Do YYYY');

  var lat;
  var lon;
  var saveCities = JSON.parse(localStorage.getItem("saveCities"));

  if (!Array.isArray(saveCities)) {
    saveCities = [];
  }

$("#currentDay").append(date);
$("#submit").click(function(){
  saveCities.push($(".cityInput").val());
  console.log(saveCities);

  localStorage.setItem("saveCities", JSON.stringify(saveCities));
  renderBtn();
  oneDay($(".cityInput").val());
  fiveday($(".cityInput").val());
});
 
// Execute a function when the user releases a key on the keyboard
document.querySelector(".cityInput").addEventListener("keyup", function(event) {
// Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
  // Cancel the default action, if needed
  event.preventDefault();
  // Trigger the button element with a click
  document.getElementById("submit").click();
  }
});

  function renderBtn(){
    var localSaveCities= JSON.parse(localStorage.getItem("saveCities"));

    if (!Array.isArray(localSaveCities)) {
      localSaveCities = [];
    
    }
    //overappend fix
    $("#btnarea").empty();
    for(var i=0;i<localSaveCities.length;i++) {
      var btn=$("<btn>");
      
      btn.text(localSaveCities[i]);
      btn.attr("value",localSaveCities[i])
      btn.attr("class","btn-group-vertical cityBtn ")
      // console.log(localSaveCities[i])
      $("#btnarea").append(btn);
    }

    $(".cityBtn").click(function() {
      // alert($(this).attr("value"))
      oneDay($(this).attr("value"));
      fiveday($(this).attr("value"));
    });
  }

  function oneDay(city){
    //api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}
    //console.log url (verify it works)
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+apikey;
    //empty all icons before calling ajax
      $("#icon").empty();

  $.ajax({
    url: queryURL,
    method: "GET",
    }).then(function (response) {
      
      var iconcode = response.weather[0].icon;
      // var iconcode = (a.weather[0].icon).val();
      var iconurl = "http://openweathermap.org/img/wn/" + iconcode + "@2x.png";
      var img=$("<img>");
      img.attr("id","weatherIcon");
      img.attr('src', iconurl);

      var tempF = (response.main.temp - 273.15) * 1.80 + 32;

      $("#city").text(response.name);
      $("#icon").append(img);
      $("#temp").text("Temperature: " + tempF.toFixed(2) + " °F");
      $("#humi").text("Humidity: " + response.main.humidity);
      $("#wind").text("Wind Speed: " + response.wind.speed);
      
      lon=response.coord.lon;
      lat=response.coord.lat;
    
      var queryURL2 = "http://api.openweathermap.org/data/2.5/uvi?appid="+apikey+"&lat="+lat+"&lon="+lon;
            //uv: lat and lon you will call another ajax 
            $("#uvIndex").empty();
            
        $.ajax({
          url: queryURL2,
          method: "GET",
        }).then(function (uvObj) {
          //1.a createurl //WORK ON THIS URL
          //1.b useajax
          //1.c grab data
          // console.log(uvObj.value);
          
          //dynamically append uv val to html
          //dynamically add to html

          //<span id="uvIndexVal"></span>
          
          // var uvDiv=$("<div>");
          // uvDiv.attr("id","uv");
          $("#uvIndex").text("UV Index: ");
          var uvSpan=$("<span>");
          // $('#uvIndexVal').text(uvObj.value);
          var uvIndexVal= parseInt(uvObj.value);

          //color code UV
          if (uvIndexVal > 6) {
            uvSpan.attr("class", "high");
          }
          if(uvIndexVal > 3 && uvIndexVal < 5){
            uvSpan.attr("class", "moderate");
          }
          if(uvIndexVal < 2) {
            uvSpan.attr("class", "low");
          }
          uvSpan.text(uvObj.value);
          $("#uvIndex").append(uvSpan);
        });
    });    
  };


//2. fx for fiveday
  function fiveday(city){
    //console.log url (verify it works)
    //use ajax, verify object returns
    var apikey="7b866cf1c2449cde360219a43c1dc318";
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&appid="+apikey;
    //  console.log(queryURL);
    
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      //clear out area before append
      $("#fiveDayDiv").empty();
      for(var i=0;i<5;i++){
        //i*8=24hours

        //DISPLAY AND LOOP FOR DATE
         var currFiveDay=moment(response.list[i*8].dt_txt).format('MMMM Do YYYY');
         var fiveDayCol=$("<div>");
         fiveDayCol.attr("class", "col");
         var displayFiveDate = $("<p>").text(currFiveDay);
         
        //DISPLAy WEATHER ICON
        var iconcode = (response.list[i*8].weather[0].icon);
        var iconurl = "http://openweathermap.org/img/wn/" + iconcode + ".png";
        var img=$("<img>");
        img.attr("id", "fiveDayIcon");
        img.attr("src", iconurl);
        //$('#weatherIcon2').attr('src', iconurl);

        var tempF =$("<div>");
        tempF.attr("id","fiveDayTemp");
        var tempFarOrigin = ((response.list[i*8].main.temp) - 273.15) * 1.80 + 32;
        tempF.text("Temp: " + tempFarOrigin.toFixed(2) + " °F");

        var humi=$("<div>");
        humi.attr("id","fiveDayHumi");
        humi.text("Humidity: " + response.list[i*8].main.humidity + "%");
        fiveDayCol.append(displayFiveDate)
        $("#fiveDayDiv").append(fiveDayCol);
        fiveDayCol.append(img);
        fiveDayCol.append(tempF);
        fiveDayCol.append(humi);
          
      }});
  };
});
//3

//AJAX call - get reponse

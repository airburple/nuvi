/*  
    Author: Aaron Burrell
    Date: 6/03/2016
    This is the javascript for the Nuvi coding challenge. It parses through JSON to create
    a UI that enables likes and comments for social media posts from various sources.
    It also shows a graphical display of how the sources of these activities break down.
*/

    var xmlhttp = new XMLHttpRequest(); //initialize the XMLHttp request

    var myArr; // array to store JSON object from the get request to endpoint
    var url = "https://nuvi-challenge.herokuapp.com/activities"; // where to send get request
       
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                myArr = JSON.parse(xmlhttp.responseText);

                // with myArr set to the JSON call the function that renders the data into html
                tableFunction(myArr); 
                
            }
        };

        xmlhttp.open("GET", url, true);
        xmlhttp.send();

    var LID // LID is the id of the <TD> associated with Like Thumb Icon 

    // thumb function is an on click event handler that changes the thumb icon blue and incraments 
    // and displays the updated count of associated likes. The Param passed along is this TD element.
    var thumb  = function(param){
        param.innerHTML = '<img class = "thumb_img" src="blue_thumb.png">'; // swap to blue icon
        LID = param.previousSibling.id;
            
            // loop through myArr until the id is found and add 1 to the count
            for(i = 0; i < myArr.length; i++)
             {
                if(myArr[i].id == param.id){
                    //console.log('match found');
                    myArr[i].activity_likes ++;
                   // console.log(myArr[i].activity_likes);
                    document.getElementById(LID).innerHTML = myArr[i].activity_likes; //render change
                }
             }
            //console.log(LID); 
            

        }
        
        // a simple hover handler for the thumbs up icons
        var thumb_hover  = function(param){
            param.innerHTML = '<img class = "thumb_img" src="blue_thumb.png">';
        }

        // the onclick event handler for the button that displays the graphical display
        var graph = function(){
            document.getElementById("media").style.display='none';
            document.getElementById("words").style.display='none';
            document.getElementById("displayButton").style.display='none';
            document.getElementById("actionsButton").style.display='inline';      
            document.getElementById("charts").style.display='inline';  
           

            
        }
        // coorisponding event handler for returning to the table of activities 
        var  activities = function (){
            document.getElementById("media").style.display='inline';
            document.getElementById("words").style.display='inline';
            document.getElementById("displayButton").style.display='inline';
            document.getElementById("actionsButton").style.display='none';  
            document.getElementById("charts").style.display='none';     
        }

        // on click of the comment icon pops up this modal comment box
        var modal = function(param) {
             var comment = prompt("Enter a comment", "Wow, what an amazing post!");

             //the param is the 5th sibling to the right of the username, we use .previousSibling to access the coorisponding
             //user which is also a way to access the id for storing the comment into myArr
             var user = param.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.innerHTML
             //TODO add comment to myArr as new key 

                 if (comment != null) {
                 document.getElementById("words").innerHTML = "you commented to "+user+": " + comment ;

                 // toogle icon to blue to show comment has been made in that row.
                 param.innerHTML = '<img class = "comment_img" src="comment_blue.png" >'; 
                 }


     
}
   
        // THis is the meat and potatoes of the JSON handling. The array is passed in and parsed,
        // the most relevent data is rendered into the table and element id's are set based on the
        // id of the JSON element. This is also where the count of each type of social media post is made
        // for use in graphs. 
        var tableFunction = function(arr) {
            var out = ""; //store the HTML string here
            var i; //index
            var temp_string =""; // for later comparisons
           
            // store the coorisponding post counts here
            var temp_tweets=0;
            var temp_inst=0;
            var temp_fbs=0;
            var temp_tumb=0;


            // set up the table headers
            out += ' <TR>';
            out += ' <TH>Social Media Provider</TH>';
            out += ' <TH>User Name</TH>';
            out += ' <TH>Date Posted</TH>';
            out += ' <TH>Content Posted</TH>';
            out += ' <TH>Content Likes</TH>';
            out += ' <TH>Like</TH>';
            out += ' <TH>Comment</TH>';
            out += ' </TR>';


            //loop through each activity in the array and create a new row for each.
            //each column coorisponds to the headers above.
            for(i = 0; i < arr.length; i++) {
                
                //before moving on to concatinating our out variable
                //use this filter to count all posts per provider.
                    if (myArr[i].provider=='twitter'){
                        temp_tweets ++;
                        
                    }else if (myArr[i].provider=='facebook'){
                        temp_fbs ++;
                    }
                    else if (myArr[i].provider=='tumblr'){
                        temp_tumb++;
                    }
                    else if (myArr[i].provider=='instagram'){
                        temp_inst ++;
                    }

                
            
                    // this is used to see if the post is an image.
                    temp_string = arr[i].activity_message;
               

                    out += '<TR id = "tweets"><TD>';

                    out += arr[i].provider + ' '; // provider = twitter, facebook etc
                    out += '</TD><TD>';

                    out += arr[i].actor_username; // username
                    out += '</TD><TD>';

                    out += arr[i].activity_date + ' '; // post date
                    out += '</TD><TD>';

                    // if the post contains an image, render the image
                    if (temp_string.includes('http')){
                        out+= '<img class = "activity_img" src="'; // post image
                        out+= arr[i].activity_message; 
                        out+= '">';

                    // else just print the message    
                    }else {
                        out += arr[i].activity_message + ' '; // post message
                    }
                    out += '</TD><TD id = "';

                    out+= arr[i].id;
                    out+='L">'; // since id's are unique add L to create LikeID

                    out += arr[i].activity_likes;

                    out += '</TD><TD class = "thumbs" onclick = "thumb(this)" id = "'; // set up the grey thumb icon field
                    out += arr[i].id;
                    out += '">';

                    out += '<img class = "thumb_img" src="grey_thumb.png" >';

                    out += '</TD><TD  id =';
                    out += myArr[i].id;
                    out += 'C class = "comments"  onclick = "modal(this)">'; // comments field, also starts with grey icon
                    out += '<img class = "comment_img" src="comment_grey.png" >';

                    out += '</TD></TR>';
                
            }
            

            document.getElementById("media").innerHTML = out; // once we have the TABLE set render it in Table with id="media"
            drawChart( temp_tweets, temp_inst, temp_fbs, temp_tumb); // we have the counts so pass them to the drawChart function 
        }
       
       // this is from google charts, this looked to be a clean option to render charts, since no libraries had to be 
       //downloaded. I use this to graph two charts, one pie chart and one bar graph to show how the given data stacks up


      // Load the Visualization API and the corechart package.
      google.charts.load('current', {'packages':['corechart']});

      // Set a callback to run when the Google Visualization API is loaded.
      google.charts.setOnLoadCallback(drawChart);

      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it. I pass along the count of each type of post, this could also be useful for showing 
      //what dates where the most active or which type of post gets the most likes.
      var drawChart = function( temp_tweets, temp_inst, temp_fbs, temp_tumb) {

    
        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Provider');
        data.addColumn('number', 'Posts');
        data.addRows([
          ['Twitter', temp_tweets],
          ['Facebook', temp_fbs],
          ['Tumblr', temp_tumb],
          ['Instagram', temp_inst]     
        ]);

        // Set charts options, the only real change is the title.
        var options = {'title':'Total Posts From Each Source Mention Your Product',
                       'width':400,
                       'height':300};

         var options2 = {'title':'Percentage of Posts From Each Source.',
                       'width':400,
                       'height':300};

        // The two charts are called and drawn here.
        var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
        chart.draw(data, options);
        var chart2 = new google.visualization.PieChart(document.getElementById('chart2_div'));
        chart2.draw(data, options2);
      }
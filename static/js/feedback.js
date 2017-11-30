buttonStuff = {
'listening': false,
'respect': false,
'civility': false,
'cooperation': false,
'snowflake': false,
'other': false
}

function findActiveButtons(){
var lst = [];
Object.keys(buttonStuff).forEach(function(d){
    if(buttonStuff[d]){
    lst.push(d);
    }
})
return lst;
}

function changeButton(name){
$('#button-' + name).button('toggle');
buttonStuff[name] = !buttonStuff[name];
}

selectedStarCount = 0;
selections = {
'knowledgeable': false,
'polite': false,
'empathetic': false,
'creative': false
};
function changeSelected(key){
selections[key] = !selections[key];
console.log(selections);
console.log(key);
if($('#' + key).hasClass('glyphicon-selected')){
    console.log('truth');
    $('#' + key).removeClass('glyphicon-selected')
}
else{
    console.log('false')
    console.log($('#' + key));
    $('#' + key).addClass('glyphicon-selected')
}
}

// Paints stars up to nStars and removes paint from rest
function paintStars(nStars){
    for (i=1; i<= nStars; i++) {
        var elt = $('#star' + i.toString());
        if(!elt.hasClass('starred')){
        elt.addClass('starred');
        }
    };
    for (i=nStars + 1; i<=5; i++) {
        var elt = $('#star' + i.toString());
        if(elt.hasClass('starred')){
        elt.removeClass('starred');
        }
    };
}

function setHighlightStar(nStars){
    paintStars(nStars);
}

function setRatingStar(nStars){
    selectedStarCount = nStars;
    paintStars(nStars);
}
console.log(user.uuid);

function formSubmit(){
    console.log('formsubmit called');
    console.log('about to ajax');
    if (selectedStarCount>0){
        var json = {
            from: user.uuid,
            stars: selectedStarCount,
            badges: findActiveButtons()
        };
        console.log(json);
        $.ajax({
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(json),
            url: '/chats/',
            success: function(data){
                console.log(data);  
            },
            failure: function(result){
                console.log('failure');
            error();
            }
        });
        // TODO: Test and redirect
    }
    else {
        alert('Please add star rating');
    }
}
$(document).ready(function(){
    document.getElementById("submit").onclick = function (){ 
        formSubmit() 
    };
})
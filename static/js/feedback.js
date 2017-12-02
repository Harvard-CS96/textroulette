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

function findActiveBadges(){
    var lst = [];
    Object.keys(badgesDict).forEach(function(d){
        if(badgesDict[d]){
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
badgesDict = {
    'knowledgeable': false,
    'polite': false,
    'empathetic': false,
    'creative': false
};
function changeSelected(key){
    badgesDict[key] = !badgesDict[key];
    if($('#' + key).hasClass('fa-selected')){
        $('#' + key).removeClass('fa-selected')
    }
    else{
        $('#' + key).addClass('fa-selected')
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

function formSubmit(){
    console.log('about to ajax');
    if (selectedStarCount>0){
        var json = {
            from: user.uuid,
            stars: selectedStarCount,
            badges: findActiveBadges(),
            improvements: findActiveButtons()
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
        // redirect to profile
        window.location.href = '/profile';
    }
    else {
        // TODO: Say with whom the conversation was.
        $('.error-warn').html('Please submit at least a star rating for your conversation.')
    }
}
$(document).ready(function(){
    document.getElementById("submit").onclick = function (){
        formSubmit()
    };
})

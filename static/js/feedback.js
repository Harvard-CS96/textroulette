buttonStuff = {
    'listening': false,
    'respect': false,
    'civility': false,
    'cooperation': false,
    'snowflake': false,
    'other': false
}

abuseComment = "";
function logAbuseComment(comment){
    abuseComment = comment;
    return abuseComment;
}

abuseType = "";
function logAbuseType(type){
    abuseType = type;
    return abuseType;
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

message = "";
function setText(text){
    message = text;
    console.log(message)
    return message;
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

function abuseFormSubmit(){
    if (abuseType!==""){
        var json = {
            from: user.uuid,
            kind: abuseType,
            comment: abuseComment,
        };
        console.log('reporting abuse');
        $.ajax({
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(json),
            url: '/feedback/report/',
            success: function(data){
                console.log(data);
                console.log('success');
            },
            failure: function(result){
                console.log('failure');
            error();
            }
        });
        $('#reportModal').modal('toggle');
    }
    else {
        // TODO: Warn that an abuse type was not selected
        $('.report-error-warn').html('Please select an abuse type.')                
    }
}

function formSubmit(){
    console.log('about to ajax');
    if (selectedStarCount>0){
        var json = {
            from: user.uuid,
            stars: selectedStarCount,
            badges: findActiveBadges(),
            improvements: findActiveButtons(),
            text: message,
        };

        $.ajax({
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(json),
            url: '/feedback',
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

$(document).ready(function(){
    document.getElementById("submitAbuse").onclick = function (){
        abuseFormSubmit()
    };
})
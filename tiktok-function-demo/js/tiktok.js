// combines numbers together to make one number
function statsAlgorithm(numLikes, numComments, numShares) {
    return Math.round(numLikes * numComments * numShares / 100);
}

// ranking algorithm
function rankingAlgorithm(numLikes, numComments, numShares, comment, ifFriend, ifFavorited, favThing) {
    // returns stats
    let statValue = statsAlgorithm(numLikes, numComments, numShares);
    console.log(statValue);
    // calculates length of stats
    let statValueString = statValue.toString(10);
    let statLength = statValueString.length;
    //returns number in placement
    let rank = statLength * -1 + 100;
    console.log(rank);
    // checks if favorited/friended then rewards
    if (ifFriend === "y") {
        rank = -5;
    }
    if (ifFavorited === "y") {
        rank = -3;
    }
    // checks if favthing matches with comment and rewards ranking otherwise it just returns
    if (rank < 1) {
        rank = 1;
    } else if (rank > 100) {
        rank = 100;
    }
    if (comment.includes(favThing)) {
        return 1;
    } else {
        return rank;
    }
}

function rankingCall() {
    // favthing prompts
    let favThing = prompt("What is you favorite thing?");
    // num prompts
    let numLikes = Number(prompt("How many likes did this tiktok get?"));
    let numShares = Number(prompt("How many shares did this tiktok get?"));
    let numComments = Number(prompt("How many comments did this tiktok get?"));
    // comment prompt
    let comment = prompt("What is the most recent comment on this tiktok?");
    // friend/fav prompt
    let ifFriend = prompt("Is this a tiktok from your friend? (y/n)");
    let ifFavorited = prompt("Have you favorited this tiktok? (y/n)");

    // function call and return
    let rankingReturn = rankingAlgorithm(numLikes, numComments, numShares, comment, ifFriend, ifFavorited, favThing);
    alert("This tiktok is #" + rankingReturn);
}

function showUI() {
    let likeCount = Number(document.getElementById("like-textbox").value);
    let shareCount = Number(document.getElementById("share-textbox").value);
    let commentCount = Number(document.getElementById("comment-textbox").value);
    let favThing = document.getElementById("fav-thing-textbox").value;
    let topComment = document.getElementById("top-comment-textbox").value;

    let rankResult = rankingAlgorithm(likeCount, commentCount, shareCount, topComment, "n", "n", favThing);

    document.getElementById("result-paragraph").innerHTML = "Tiktok Rank: " + rankResult;
}

showUI();
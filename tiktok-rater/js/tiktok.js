function magicAlgorithm(numLikes, comment, numShares, numFollows) {

    let rank = 0;



    if (numLikes >= 10000 && comment.includes("pancake") && numShares >= 1000 && numFollows >= 100) {

        rank = 1;

    } else if (numLikes >= 500 && comment.includes("waffle") && numShares >= 500 && numFollows >= 50) {

        rank = 100;

    } else {

        rank = 1000;

    }



    return rank

}

function showUI() {

    let likeCounts = Number(document.getElementById("like-textbox").value);

    let comment = document.getElementById("comment-textbox").value;

    let shares = Number(document.getElementById("shares-textbox").value);

    let follows = Number(document.getElementById("follows-textbox").value);



    let rankResult = magicAlgorithm(likeCounts, comment, shares, follows);



    document.getElementById("result-paragraph").innerHTML = "Tiktok Rank: " + rankResult;

}

showUI()
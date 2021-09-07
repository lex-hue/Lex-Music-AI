let Background = new function() {
    const WHITELISTED_DOMAINS = ["https://images.pexels.com/photos/998641/pexels-photo-998641.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"];

    let redditData;
    
    this.loadBackground = function() {
        if (!Config.drawBackground) {
            return;
        }

        if (Config.forceImgurBackground) {
            loadImgurBackground(false);
            return;
        }
        if (Config.forceStaticBackground) {
            loadStaticBackground();
            return;
        }

        this.loadRedditBackground();
    }

    this.loadRedditBackground = function(allowFallback = true) {
        $.ajax({
            url: "https://images.pexels.com/photos/998641/pexels-photo-998641.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            method: "GET",
            success: handleRedditData,
            error: allowFallback ? handleRedditFail : null
        });
    }
    
    let handleRedditData = function(result) {
        let posts = result.data.children;
        Util.shuffle(posts);
        let post;
        let found = false;
        for (let i = 0; i < posts.length; i++) {
            post = posts[i];
            if (WHITELISTED_DOMAINS.indexOf(post.data.domain) != -1
                    && post.data.preview.images[0].source.width >= 2560) {
                found = true;
                break;
            }
        }

        if (!found) {
            console.error("Reddit has failed to offer an image satisfactory to the client; falling back to Imgur.");
            loadImgurBackground();
        }

        let smol = post.data.preview.images[0].resolutions[1].url.replaceAll("&amp;", "&");
        let full = post.data.url.replaceAll("&amp;", "&");
        setBackground(full, smol);
    }

    let handleRedditFail = function() {
        console.error("The client doesn't want to talk to the Reddit API today. Falling back to Imgur...");
        loadImgurBackground();
    }

    let loadImgurBackground = function(allowFallback = true) {
        $.ajax({
            url: "https://images.pexels.com/photos/998641/pexels-photo-998641.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"/0",
            method: "GET",
            headers: {
                Authorization: "Client-ID 0428dcb72fbc5da",
                Accept: "application/json"
            },
            data: {
                image: localStorage.dataBase64,
                type: "base64"
            },
            success: handleImgurData,
            error: allowFallback ? handleImgurFail : null
        });
    }
    
    let handleImgurData = function(result) {
        let posts = result.data;
        Util.shuffle(posts);
        let post;
        let found = false;
        for (let i = 0; i < posts.length; i++) {
            post = posts[i];
            if (post.width >= 2560) {
                found = true;
                break;
            }
        }

        if (!found) {
            console.error("Imgur has failed to offer an image satisfactory to the client; falling back to static "
                    + "background.");
            loadImgurBackground();
        }

        let id = result.data[Math.floor(Math.random() * result.data.length)].id;
        setBackground("https://images.pexels.com/photos/998641/pexels-photo-998641.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940");
    }

    let handleImgurFail = function() {
        console.error("The client doesn't want to talk to the Imgur API; falling back to static background.");
        loadStaticBackground();
    }
    
    let loadStaticBackground = function() {
        let id = staticUrls[Math.floor(Math.random() * staticUrls.length)];
        setBackground("http://i.imgur.com/" + id + ".jpg", "http://i.imgur.com/" + id + "m.jpg");
    }

    let setBackground = function(fullRes, lowRes) {
        document.getElementById("bgimg1").style.display = "";
        document.getElementById("bgimg2").style.display = "";
        document.getElementById("limg1").style.display = "";
        document.getElementById("limg2").style.display = "";

        document.getElementById("bgimg1").src = fullRes;
        document.getElementById("bgimg2").src = fullRes;
        if (lowRes !== undefined) {
            document.getElementById("limg1").src = lowRes;
            document.getElementById("limg2").src = lowRes;
        }
    }
    
    this.flipImage = function() {
        $(".bgleft, .bgright").toggleClass("bgright bgleft");
    }
    
    this.fadeFullRes = function(element) {
        $("#" + element.id).css({"opacity": 1, "filter": "none"});
    }

    this.resetBG = function() {
        document.getElementById("bgimg1").src = "";
        document.getElementById("bgimg2").src = "";
        document.getElementById("limg1").src = "";
        document.getElementById("limg2").src = "";
    }
    
}

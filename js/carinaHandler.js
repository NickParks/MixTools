function startCarina(id){
    var ca = new carina.Carina().open();
    
    ca.subscribe(`channel:${this.id}:update`, (data) => {
        //Concurrent viewer count changes
        if (data.viewersCurrent != undefined) {
            if (data.viewersCurrent > getItem("peak-viewers")) { // Check if it's greater than the previous peak
                setItem("peak-viewers", data.viewersCurrent);
                $("#peak-viewer-count").text(getItem("peak-viewers")); //Set our new peak in session storage and display to user
            }
        }

        if (data.viewersTotal != undefined) {
            setItem("new-viewers", (data.viewersTotal - getItem("starting-viewer-total"))); //Adjust unique viewer counts
            $("#unique-viewer-number").text(getItem("new-viewers"));
        }

    });

    ca.subscribe(`channel:${this.id}:followed`, (data) => {
        if (data.following) {
            setItem("new-followers", parseInt(getItem("new-followers")) + 1); //Add one to the total new followers
            var markup = "<i class='fas fa-plus'></i>" + data.user.username + " followed";
            addToTable("recent-events-table", markup);
        } else {
            setItem("new-followers", parseInt(getItem("new-followers")) - 1); //Subtract the total new followers
            var markup = "<i class='fas fa-minus'></i>" + data.user.username + " unfollowed";
            addToTable("recent-events-table", markup);
        }

        $("#net-follower-gain").text(getItem("new-followers")); //Display to the user
    });
}
import {
    Carina
} from './carina';

import {
    getItem,
    setItem
} from "./storageApi";

export class carinaHandler {

    constructor(channelId) {
        this.id = channelId;
        this.carina = new Carina().open(); //Open our Carina instance
    }

    start() {
        this.carina.subscribe(`channel:${this.id}:update`, (data) => {
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

        //Listens to follower changes
        this.carina.subscribe(`channel:${this.id}:followed`, (data) => {
            if (data.following) {
                setItem("new-followers", parseInt(getItem("new-followers")) + 1); //Add one to the total new followers
            } else {
                setItem("new-followers", parseInt(getItem("new-followers")) - 1); //Subtract the total new followers
            }

            $("#net-follower-gain").text(getItem("new-followers")); //Display to the user
        });
    }
}
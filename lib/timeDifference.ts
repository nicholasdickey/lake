function timeConverter(time:number, timestamp:number) {

    let currentStamp = Date.now() / 1000 | 0;
    if (currentStamp <= timestamp + 10){
      // console.log("using SSR timestamp")
        currentStamp = timestamp;
    }
        
    let diff = currentStamp - time
   // console.log({diff})
    if (diff < 0)
        diff = 0;
    let res;
    if (diff < 60 * 60 * 24 * 30) {
        if (diff < 60) {
            if (diff < 0)
                diff = 0;
            res = `${diff}s`;

        }
        else if (diff < 3600) {
           // console.log("less than hour")
            let d = Math.floor(diff / (60));
           
                res = `${d}m`;
        }
        else if (diff < 3600 * 24) {
           // console.log("less than day")
            let d = Math.floor(diff / (3600));
           // console.log("d:",d)
           
                res = `${d}h`
        }
        else {
            let d = Math.floor(diff / (3600 * 24));
           
                res = `${d}d`
        }
    }
    else {
        let a = new Date(time * 1000)
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        res = date + ' ' + month + ' ' + year + ' ' //+ hour + ':' + min + ':' + sec ;
    }
   // console.log("returning",res)
    return res;
}
export default timeConverter;
//./lib/time-difference.ts
function timeConverter(time:number, timestamp:number) {

    let currentStamp = Date.now() / 1000 | 0;
    if (currentStamp <= timestamp + 10){
        currentStamp = timestamp;
    }        
    let diff = currentStamp - time
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
            let d = Math.floor(diff / (60));
           
                res = `${d}m`;
        }
        else if (diff < 3600 * 24) {
            let d = Math.floor(diff / (3600));
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
    return {timeString:res,diff};
}
export default timeConverter;
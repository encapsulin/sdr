// export function fnDatePlusHours(now,hrs){
//     now.setHours(now.getHours() + hrs);
//     return now;
// }

export function fnDatePlusDHM(now,days_,hours_,mins_){
    if(days_)
        now.setDate(now.getDate() + days_);
    if(hours_)
        now.setHours(now.getHours() + hours_);
    if(mins_)
        now.setMinutes(now.getMinutes() + mins_);
    return now;
}


export function fnTtlMins(now,mins){
    const oneHourLater = new Date(now.getTime() + mins * 60 * 1000); 
    // Convert to Unix timestamp (seconds since Jan 1, 1970)
    const unixTimestamp = Math.floor(oneHourLater.getTime() / 1000);
    return unixTimestamp;
}

// export function fnDateToHuman(date_){
//     let day = date_.getDate();
//     let month = date_.getMonth() + 1; // Months are zero-based
//     let year = date_.getFullYear();

//     // Add leading zeros if day or month is less than 10
//     day = day < 10 ? '0' + day : day;
//     month = month < 10 ? '0' + month : month;

//     // Return the formatted date as "dd.mm.yyyy"
//     return `${day}.${month}.${year}`;

// }

export function fnDateToIso(date_){
    return date_
    .toISOString()
    .replace(/[-:Z]/g, '')
    .replace(/[T\.]/g, '_');
}